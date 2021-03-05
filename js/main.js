// Script 

(() => {

    let yOffset = 0;
    let prevScrollHeight = 0; // Sum of scroll section heights before yOffset
    let currentScene = 0; // Current scroll-section 

    // Info of each scene
    const sceneInfo = [
        {   
            // Scene 0
            type: 'sticky',
            heightNum: 5, // Browser length adjustment
            scrollHeight: 0, 
            objs: {
                container: document.querySelector('#scroll-section-0')
            }
        },
        {   
            // Scene 1
            type: 'normal',
            heightNum: 5, 
            scrollHeight: 0, 
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        },
        {   
            // Scene 2
            type: 'sticky',
            heightNum: 5, 
            scrollHeight: 0, 
            objs: {
                container: document.querySelector('#scroll-section-2')
            }
        },
        {   
            // Scene 3
            type: 'sticky',
            heightNum: 5, 
            scrollHeight: 0, 
            objs: {
                container: document.querySelector('#scroll-section-3')
            }
        },
    ];

    // Scroll section height setting 
    const setLayout = () => {
        for (let i = 0; i < sceneInfo.length; i++) {
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        // (Exp) When page is newly loaded
        yOffset = window.pageYOffset;
        let totalScrollHeight = 0;
        for (i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    // Returning yOffset coordinates on each scroll
    const scrollLoop = () => {
        prevScrollHeight = 0;
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            currentScene++;
        }

        if (yOffset < prevScrollHeight) {
            if (currentScene === 0) return; 
            currentScene--;
        }

        document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    });
    window.addEventListener('load', setLayout);
    window.addEventListener('resize', setLayout);

})();