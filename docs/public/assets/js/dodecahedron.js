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
    camera.position.z = 8;

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
    
    // 使内部光源全局可访问，以便鼠标悬停时调整强度
    window.innerLight = innerLight;

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
            // 使模型全局可访问，以便鼠标悬停时修改材质
            window.fbxModel = fbxModel;
            
            // 移除占位十二面体
            scene.remove(placeholder);
            
            // 调整模型大小和位置
            fbxModel.scale.set(0.025, 0.025, 0.025);
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
                            // 使用不透明的材质
                            child.material = new THREE.MeshPhongMaterial({
                                map: texture,
                                emissive: new THREE.Color(0x2288ff),
                                emissiveIntensity: 0.6,
                                shininess: 30,
                                side: THREE.DoubleSide // 确保双面都渲染
                            });
                            child.material.needsUpdate = true;
                        }
                    });
                    
                    scene.add(fbxModel);
                    scene.add(borderGlass);
                    scene.add(borderLines);
                    
                    // 添加点击效果
                    let isClicked = false;
                    canvas.addEventListener('click', () => {
                        isClicked = !isClicked;
                        if (isClicked) {
                            // 点击后变为明亮的绿色
                            innerLight.intensity = 4.0;
                            innerLight.color.set(0x00ff9d);
                            
                            fbxModel.traverse((child) => {
                                if (child.isMesh) {
                                    child.material = new THREE.MeshPhongMaterial({
                                        map: texture,
                                        emissive: new THREE.Color(0x00ff9d),
                                        emissiveIntensity: 1.0,
                                        shininess: 30,
                                        side: THREE.DoubleSide // 确保双面都渲染
                                    });
                                    child.material.needsUpdate = true;
                                }
                            });
                            
                            // 让边框也变色
                            glassMaterial.color.set(0x00ff9d);
                            edgeMaterial.color.set(0x00ff9d);
                            glassMaterial.needsUpdate = true;
                            edgeMaterial.needsUpdate = true;
                        } else {
                            // 再次点击恢复蓝色
                            innerLight.intensity = 2.0;
                            innerLight.color.set(0x00ccff);
                            
                            fbxModel.traverse((child) => {
                                if (child.isMesh) {
                                    child.material = new THREE.MeshPhongMaterial({
                                        map: texture,
                                        emissive: new THREE.Color(0x2288ff),
                                        emissiveIntensity: 0.6,
                                        shininess: 30,
                                        side: THREE.DoubleSide // 确保双面都渲染
                                    });
                                    child.material.needsUpdate = true;
                                }
                            });
                            
                            // 恢复边框颜色
                            glassMaterial.color.set(0x66ccff);
                            edgeMaterial.color.set(0x66ccff);
                            glassMaterial.needsUpdate = true;
                            edgeMaterial.needsUpdate = true;
                        }
                    });
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
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log(`模型加载进度: ${Math.round(percentComplete)}%`);
        },
        (error) => {
            console.error("加载FBX模型时出错:", error);
        }
    );

    // 添加悬停检测函数
    function onMouseEnter() {
        if (!window.fbxModel) return;
        
        // 增强内部光源
        if (window.innerLight) {
            window.innerLight.intensity = 3.0;
        }
        
        // 增强发光效果
        window.fbxModel.traverse((child) => {
            if (child.isMesh) {
                // 存储原始颜色和强度
                if (!child.userData.originalEmissive) {
                    child.userData.originalEmissive = child.material.emissive.clone();
                    child.userData.originalIntensity = child.material.emissiveIntensity;
                }
                
                // 将发光颜色改为绿色并增强强度
                child.material.emissive.set(0x00ff9d); // 绿色
                child.material.emissiveIntensity = 1.0;
                child.material.needsUpdate = true;
            }
        });
    }

    function onMouseLeave() {
        if (!window.fbxModel) return;
        
        // 恢复内部光源
        if (window.innerLight) {
            window.innerLight.intensity = 2.0;
        }
        
        // 恢复发光效果
        window.fbxModel.traverse((child) => {
            if (child.isMesh) {
                if (child.userData.originalEmissive) {
                    child.material.emissive.copy(child.userData.originalEmissive);
                    child.material.emissiveIntensity = child.userData.originalIntensity;
                    child.material.needsUpdate = true;
                }
            }
        });
    }

    // 为容器添加鼠标悬停事件
    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);

    // 用于动画的时钟
    const clock = new THREE.Clock();
    
    // 动画循环
    function animate() {
        requestAnimationFrame(animate);
        
        const delta = clock.getDelta();
        
        // 缓慢旋转模型
        if (fbxModel) {
            fbxModel.rotation.y += delta * 0.2;
            // 稍微上下浮动
            fbxModel.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
        }
        
        // 更新控制器
        controls.update();
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // 处理窗口调整大小
    function onWindowResize() {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        
        renderer.setSize(newWidth, newHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // 返回清理函数
    return () => {
        window.removeEventListener('resize', onWindowResize);
        container.removeEventListener('mouseenter', onMouseEnter);
        container.removeEventListener('mouseleave', onMouseLeave);
        
        // 停止动画
        if (fbxModel) {
            scene.remove(fbxModel);
        }
        
        // 释放资源
        renderer.dispose();
    };
}

// 如果直接加载页面，则自动初始化
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('dodecahedronContainer') && 
        document.getElementById('dodecahedronCanvas')) {
        console.log("页面加载完成，自动初始化3D模型");
        initThreeDodecahedron();
    }
}); 