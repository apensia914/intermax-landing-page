// Script 

(() => {

    let yOffset = 0;
    let prevScrollHeight = 0; // Sum of scroll section heights before yOffset
    let currentScene = 0; // Current section 
    let enterNewScene = false; // Value will be True once new scene starts 

    // Info of each scene
    const sceneInfo = [
        {   
            // Scene 0
            type: 'sticky',
            heightNum: 5, // Browser length adjustment
            scrollHeight: 0, 
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageFirst: document.querySelector('#scroll-section-0 .main-message.first'),
                messageSecond: document.querySelector('#scroll-section-0 .main-message.second'),
                messageThird: document.querySelector('#scroll-section-0 .main-message.third'),
                messageFourth: document.querySelector('#scroll-section-0 .main-message.fourth')
            },
            values: {
                messageFirst_opacity_in: [0, 1, {start: 0.1, end: 0.2}],
                messageFirst_opacity_out: [1, 0, {start: 0.25, end: 0.3}],
                messageFirst_translateY_in: [20, 0, {start: 0.1, end: 0.2}],
                messageFirst_translateY_out: [0, -20, {start: 0.25, end: 0.3}],
                messageSecond_opacity_in: [0, 1, {start: 0.3, end: 0.4}],
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

    // 
    const calcValues = (values, currentYOffset) => { 
        let rv;
        // Ratio of scrolled range on the current scene
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;
        
        if (values.length === 3) {
            // Carry out animation within start - end section
            const partialScrollStart = values[2].start * scrollHeight;
            const partialScrollEnd = values[2].end * scrollHeight;
            const partialScrollHeight = partialScrollEnd - partialScrollStart;

            if (currentYOffset >= partialScrollStart && currentYOffset <= partialScrollEnd) {
                rv = (currentYOffset - partialScrollStart) / partialScrollHeight * (values[1] - values[0]) + values[0];
            } else if (currentYOffset < partialScrollStart) {
                rv = values[0];
            } else if (currentYOffset > partialScrollEnd) {
                rv = values[1];
            }
        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }
        return rv;
    }

    // Animation 
    const playAnimation = () => {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = (yOffset - prevScrollHeight) / scrollHeight; 

        switch (currentScene) {
            case 0: 
                let messageFirst_opacity_in = calcValues(values.messageFirst_opacity_in, currentYOffset);
                let messageFirst_opacity_out = calcValues(values.messageFirst_opacity_out, currentYOffset);
                let messageFirst_translateY_in = calcValues(values.messageFirst_translateY_in, currentYOffset);
                let messageFirst_translateY_out = calcValues(values.messageFirst_translateY_out, currentYOffset);

                if (scrollRatio <= 0.22) {
                    objs.messageFirst.style.opacity = messageFirst_opacity_in;
                    objs.messageFirst.style.transform = `translateY(${messageFirst_translateY_in}%)`;
                } else {
                    objs.messageFirst.style.opacity = messageFirst_opacity_out;
                    objs.messageFirst.style.transform = `translateY(${messageFirst_translateY_out}%)`;
                }
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
        }
    }


    // Returning yOffset coordinates on each scroll
    const scrollLoop = () => {
        enterNewScene = false;
        prevScrollHeight = 0;
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (yOffset < prevScrollHeight) {
            enterNewScene = true;
            if (currentScene === 0) return; // Prevent bouncing error in Chrome
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (enterNewScene) return;

        playAnimation();
    }

    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    });
    window.addEventListener('load', setLayout);
    window.addEventListener('resize', setLayout);

})();