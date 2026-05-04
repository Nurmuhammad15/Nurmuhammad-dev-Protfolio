import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.158.0/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, bee, mixer, clock;
let mouse = new THREE.Vector2();
let targetBeePosition = new THREE.Vector3();

const init = () => {
    // 1. Инициализация сцены, камеры, рендерера
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('forestCanvas'),
        antialias: true // Сглаживание краев
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true; // Включаем тени
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Тип теней
    renderer.outputColorSpace = THREE.SRGBColorSpace; // Правильная цветовая гамма

    clock = new THREE.Clock();

    // 2. Освещение
    // Направленный свет (как солнце)
    const directionalLight = new THREE.DirectionalLight(0xffffee, 3); // Цвет, интенсивность
    directionalLight.position.set(5, 10, 5); // Позиция источника света
    directionalLight.castShadow = true; // Свет отбрасывает тени
    directionalLight.shadow.mapSize.width = 2048; // Разрешение теней
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    // Фоновое освещение (ambient light)
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    // 3. Загрузка 3D-моделей
    const loader = new GLTFLoader();

    // Загрузка сцены леса
    loader.load('models/forest_scene.glb', (gltf) => {
        const forest = gltf.scene;
        forest.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                // Более реалистичные материалы (PBR)
                if (node.material) {
                    node.material.roughness = 0.8;
                    node.material.metalness = 0.1;
                    node.material.color.convertSRGBToLinear(); // Важно для правильной цветовой гаммы
                }
            }
        });
        scene.add(forest);
        console.log('Лес загружен!');

        // Если в сцене леса есть анимации (например, покачивание деревьев), инициализируем микшер
        if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(forest);
            gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
            });
        }

        // Размещаем цветы (пример)
        // В реальном проекте цветы будут частью forest_scene.glb или будут загружены отдельно и распределены
        const createFlower = (color) => {
            loader.load(`models/flower_${color}.glb`, (flowerGltf) => {
                const flower = flowerGltf.scene;
                flower.scale.set(0.1, 0.1, 0.1); // Пример масштаба
                flower.position.set(
                    Math.random() * 20 - 10, // Случайная позиция по X
                    0.5, // Позиция по Y (над землей)
                    Math.random() * 20 - 10 // Случайная позиция по Z
                );
                flower.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });
                scene.add(flower);
            });
        };
        createFlower('yellow');
        createFlower('red');
        createFlower('yellow');
        createFlower('red');
    }, undefined, (error) => {
        console.error('Ошибка загрузки леса:', error);
    });

    // Загрузка 3D-модели пчелы
    loader.load('models/bee_model.glb', (gltf) => {
        bee = gltf.scene;
        bee.scale.set(0.05, 0.05, 0.05); // Размер пчелы
        bee.position.set(0, 2, 0); // Начальная позиция
        scene.add(bee);
        console.log('Пчела загружена!');

        // Если у пчелы есть анимация полета/жужжания
        if (gltf.animations && gltf.animations.length > 0) {
            const beeMixer = new THREE.AnimationMixer(bee);
            gltf.animations.forEach((clip) => {
                beeMixer.clipAction(clip).play();
            });
            // Обновляем общий микшер, чтобы он включал анимацию пчелы
            mixer = beeMixer; // Если только одна анимация
            // Если анимаций несколько, нужно управлять ими более сложно
        }
    }, undefined, (error) => {
        console.error('Ошибка загрузки пчелы:', error);
    });

    // Позиционирование камеры
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 2, 0); // Смотрим на центр сцены

    // 4. Обработчики событий (изменение размера окна, движение мыши)
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);

    // Запускаем цикл анимации
    animate();
};

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

const onMouseMove = (event) => {
    // Нормализуем координаты мыши от -1 до +1
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Вычисляем трехмерную позицию для пчелы (проекция из 2D в 3D)
    // Это очень упрощенный способ. Для точного следования нужно использовать Raycaster
    targetBeePosition.set(mouse.x * 10, mouse.y * 5 + 3, camera.position.z - 5); // Корректируем Z для расстояния
};

const animate = () => {
    requestAnimationFrame(animate); // Запрашиваем следующий кадр

    const delta = clock.getDelta();

    // Обновляем анимации, если есть микшер
    if (mixer) {
        mixer.update(delta);
    }

    // Плавное следование пчелы за курсором
    if (bee) {
        // Интерполяция для плавности
        bee.position.lerp(targetBeePosition, 0.05);
        // Можно добавить легкое "парение"
        bee.position.y += Math.sin(Date.now() * 0.005) * 0.02;
    }

    // Добавляем движение камеры при прокрутке (пример)
    // window.scrollY можно использовать для привязки к прокрутке,
    // но в 3D лучше управлять камерой напрямую.
    // Например, можно двигать камеру по кругу:
    // camera.position.x = Math.sin(Date.now() * 0.0001) * 10;
    // camera.position.z = Math.cos(Date.now() * 0.0001) * 10;
    // camera.lookAt(0, 2, 0);


    // Рендерим сцену
    renderer.render(scene, camera);
};

// Запускаем инициализацию
init();