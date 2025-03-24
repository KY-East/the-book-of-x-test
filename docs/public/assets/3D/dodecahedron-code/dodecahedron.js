/**
 * 3D十二面体FBX模型加载初始化
 */
function initThreeDodecahedron() {
    console.log("正在初始化3D模型...");
    const container = document.getElementById('dodecahedronContainer');
    if (!container) {
        console.error("找不到容器元素");
        return;
    }

    const canvas = document.getElementById('dodecahedronCanvas');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 创建场景、相机和渲染器
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0x888888);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.6, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xfffae5, 0.4, 100);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // 添加内部光源 - 蓝色
    const innerLight = new THREE.PointLight(0x00ccff, 2.0, 20);
    innerLight.position.set(0, 0, 0);
    scene.add(innerLight);

    // 加载过程中显示简单的占位十二面体
    const placeholderGeometry = new THREE.DodecahedronGeometry(3, 0);
    const placeholderMaterial = new THREE.MeshPhongMaterial({
        color: 0x111122,
        emissive: 0x3399ff,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.5,
        wireframe: true
    });
    const placeholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
    scene.add(placeholder);
    
    // 创建控制器
    const controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // 加载FBX模型
    const modelPath = '/assets/3D/一个镂空的正十二面体fbx/一个镂空的正十_0324014923_texture.fbx';
    const texturePath = '/assets/3D/一个镂空的正十二面体fbx/一个镂空的正十_0324014923_texture.png';
    const loader = new THREE.FBXLoader();
    let fbxModel;
    
    console.log("开始加载FBX模型:", modelPath);
    // 尝试使用encodeURI处理路径
    const encodedModelPath = encodeURI(modelPath);
    const encodedTexturePath = encodeURI(texturePath);
    
    console.log("编码后的路径:", encodedModelPath);
    
    loader.load(
        encodedModelPath,
        (object) => {
            console.log("FBX模型加载成功", object);
            fbxModel = object;
            // 移除占位十二面体
            scene.remove(placeholder);
            
            // 调整模型大小和位置
            fbxModel.scale.set(0.02, 0.02, 0.02);
            fbxModel.position.set(0, 0, 0);
            
            // 添加玻璃边框效果
            const bbox = new THREE.Box3().setFromObject(fbxModel);
            const size = new THREE.Vector3();
            bbox.getSize(size);
            
            const borderGeometry = new THREE.BoxGeometry(size.x * 1.15, size.y * 1.15, size.z * 1.15);
            
            // 创建玻璃材质
            const glassMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x66ccff,
                transparent: true,
                opacity: 0.15,
                roughness: 0.1,
                metalness: 0.1,
                reflectivity: 0.5,
                clearcoat: 0.5,
                clearcoatRoughness: 0.1,
                side: THREE.DoubleSide
            });
            const borderGlass = new THREE.Mesh(borderGeometry, glassMaterial);
            
            // 保留线框边缘
            const borderEdges = new THREE.EdgesGeometry(borderGeometry);
            const edgeMaterial = new THREE.LineBasicMaterial({
                color: 0x66ccff,
                transparent: true,
                opacity: 0.4
            });
            const borderLines = new THREE.LineSegments(borderEdges, edgeMaterial);
            
            // 加载纹理
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(
                encodedTexturePath,
                (texture) => {
                    console.log("纹理加载成功");
                    // 应用纹理到模型所有部分
                    fbxModel.traverse((child) => {
                        if (child.isMesh) {
                            child.material.map = texture;
                            child.material.transparent = true;
                            child.material.opacity = 0.9;
                            // 添加内发光效果
                            child.material.emissive = new THREE.Color(0x2288ff);
                            child.material.emissiveIntensity = 0.6;
                            child.material.needsUpdate = true;
                        }
                    });
                    
                    scene.add(fbxModel);
                    scene.add(borderGlass);
                    scene.add(borderLines);
                },
                undefined, // 进度回调
                (error) => {
                    console.error("纹理加载失败:", error);
                    // 即使没有纹理也添加模型
                    scene.add(fbxModel);
                    scene.add(borderGlass);
                    scene.add(borderLines);
                }
            );
        },
        (xhr) => {
            // 加载进度
            const percent = Math.floor((xhr.loaded / xhr.total) * 100);
            console.log(`模型加载进度: ${percent}%`);
        },
        (error) => {
            console.error("FBX模型加载失败:", error);
            // 尝试使用相对路径
            const relativePath = '../../assets/3D/一个镂空的正十二面体fbx/一个镂空的正十_0324014923_texture.fbx';
            console.log("尝试使用相对路径:", relativePath);
            
            // 对相对路径同样进行编码
            const encodedRelativePath = encodeURI(relativePath);
            console.log("编码后的相对路径:", encodedRelativePath);
            
            loader.load(
                encodedRelativePath,
                (object) => {
                    console.log("使用相对路径加载成功");
                    fbxModel = object;
                    scene.remove(placeholder);
                    
                    fbxModel.scale.set(0.02, 0.02, 0.02);
                    fbxModel.position.set(0, 0, 0);
                    
                    const bbox = new THREE.Box3().setFromObject(fbxModel);
                    const size = new THREE.Vector3();
                    bbox.getSize(size);
                    
                    const borderGeometry = new THREE.BoxGeometry(size.x * 1.15, size.y * 1.15, size.z * 1.15);
                    
                    // 创建玻璃材质
                    const glassMaterial = new THREE.MeshPhysicalMaterial({
                        color: 0x66ccff,
                        transparent: true,
                        opacity: 0.15,
                        roughness: 0.1,
                        metalness: 0.1,
                        reflectivity: 0.5,
                        clearcoat: 0.5,
                        clearcoatRoughness: 0.1,
                        side: THREE.DoubleSide
                    });
                    const borderGlass = new THREE.Mesh(borderGeometry, glassMaterial);
                    
                    // 保留线框边缘
                    const borderEdges = new THREE.EdgesGeometry(borderGeometry);
                    const edgeMaterial = new THREE.LineBasicMaterial({
                        color: 0x66ccff,
                        transparent: true,
                        opacity: 0.4
                    });
                    const borderLines = new THREE.LineSegments(borderEdges, edgeMaterial);
                    
                    // 加载纹理 - 相对路径
                    const relativeTexturePath = '../../assets/3D/一个镂空的正十二面体fbx/一个镂空的正十_0324014923_texture.png';
                    const encodedRelativeTexturePath = encodeURI(relativeTexturePath);
                    const textureLoader = new THREE.TextureLoader();
                    textureLoader.load(
                        encodedRelativeTexturePath,
                        (texture) => {
                            fbxModel.traverse((child) => {
                                if (child.isMesh) {
                                    child.material.map = texture;
                                    child.material.transparent = true;
                                    child.material.opacity = 0.9;
                                    // 添加内发光效果
                                    child.material.emissive = new THREE.Color(0x2288ff);
                                    child.material.emissiveIntensity = 0.6;
                                    child.material.needsUpdate = true;
                                }
                            });
                            
                            scene.add(fbxModel);
                            scene.add(borderGlass);
                            scene.add(borderLines);
                        },
                        undefined,
                        (error) => {
                            console.error("纹理加载失败(相对路径):", error);
                            scene.add(fbxModel);
                            scene.add(borderGlass);
                            scene.add(borderLines);
                        }
                    );
                },
                (xhr) => {
                    const percent = Math.floor((xhr.loaded / xhr.total) * 100);
                    console.log(`模型加载进度(相对路径): ${percent}%`);
                },
                (error) => {
                    console.error("FBX模型加载失败(相对路径):", error);
                    // 显示占位模型
                    scene.add(placeholder);
                }
            );
        }
    );
    
    // 旋转动画
    function animate() {
        requestAnimationFrame(animate);
        
        if (controls) controls.update();
        
        if (fbxModel) {
            fbxModel.rotation.y += 0.002;
        } else {
            placeholder.rotation.y += 0.01;
        }
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // 处理窗口大小变化
    window.addEventListener('resize', () => {
        if (!container) return;
        
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        
        renderer.setSize(newWidth, newHeight);
    });
} 