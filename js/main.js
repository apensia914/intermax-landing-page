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
                messageFourth: document.querySelector('#scroll-section-0 .main-message.fourth'),
                // Video canvas sequence
                canvas: document.querySelector('#video-canvas-0'),
                context: document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages: []
            },
            values: {
                videoImageCount: 480,
                imageSequence: [0, 479],
                canvasOpacity: [1, 0, {start: 0.9, end: 1}],
                messageFirst_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                messageSecond_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageThird_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageFourth_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
                messageFirst_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
                messageSecond_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
                messageThird_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
                messageFourth_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
                messageFirst_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messageSecond_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
                messageThird_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
                messageFourth_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                messageFirst_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
                messageSecond_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
                messageThird_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
                messageFourth_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
            }
        },
        {   
            // Scene 1
            type: 'normal',
            // heightNum: 5, 
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
                container: document.querySelector('#scroll-section-2'),
                messageFirst: document.querySelector('#scroll-section-2 .first'),
                messageSecond: document.querySelector('#scroll-section-2 .second'),
                messageThird: document.querySelector('#scroll-section-2 .third'),
                lineSecond: document.querySelector('#scroll-section-2 .second .line'),
                lineThird: document.querySelector('#scroll-section-2 .third .line'),
                // Video canvas sequence
                canvas: document.querySelector('#video-canvas-1'),
                context: document.querySelector('#video-canvas-1').getContext('2d'),
                videoImages: []
            },
            values: {
                videoImageCount: 480,
                imageSequence: [0, 479],
                canvasOpacity_in: [0, 1, {start: 0, end: 0.1}],
                canvasOpacity_out: [1, 0, {start: 0.95, end: 1}],
                messageFirst_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
                messageSecond_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
                messageThird_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
                messageFirst_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
                messageSecond_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
                messageThird_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
                messageFirst_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
                messageSecond_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
                messageThird_translateY_out: [0, -20, { start: 0.95, end: 1 }],
                messageFirst_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
                messageSecond_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
                messageThird_opacity_out: [1, 0, { start: 0.95, end: 1 }],
                lineSecond_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
                lineThird_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }]
            }
        },
        {   
            // Scene 3
            type: 'sticky',
            heightNum: 5, 
            scrollHeight: 0, 
            objs: {
                container: document.querySelector('#scroll-section-3'),
                imageCaption: document.querySelector('.image-caption')
            },
            values: {

            }
        },
    ];

    const setCanvasImages = () => {
        let imageElement;
        for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
            imageElement = new Image();
            imageElement.src = `./images/imx_logo_${1000+i}.jpg`;
            sceneInfo[0].objs.videoImages.push(imageElement);
        }

        let imageElementSecond;
        for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
            imageElementSecond = new Image();
            imageElementSecond.src = `./images/imx_logo_${1000+i}.jpg`;
            sceneInfo[2].objs.videoImages.push(imageElementSecond);
        }
    }
    setCanvasImages();

    // Scroll section height setting 
    const setLayout = () => {
        for (let i = 0; i < sceneInfo.length; i++) {
            if (sceneInfo[i].type === 'sticky') {
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if (sceneInfo[i].type === 'normal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHight;
            }
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

        const heightRatio = window.innerHeight / 1080;
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
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
        const scrollRatio = currentYOffset / scrollHeight; 

        switch (currentScene) {
            case 0:
            // console.log('0 play');
            let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
            objs.context.drawImage(objs.videoImages[sequence], 0, 0);
            objs.canvas.style.opacity = calcValues(values.canvasOpacity, currentYOffset);

            if (scrollRatio <= 0.22) {
                // in
                objs.messageFirst.style.opacity = calcValues(values.messageFirst_opacity_in, currentYOffset);
                objs.messageFirst.style.transform = `translate3d(0, ${calcValues(values.messageFirst_translateY_in, currentYOffset)}%, 0)`;
            } else {
                // out
                objs.messageFirst.style.opacity = calcValues(values.messageFirst_opacity_out, currentYOffset);
                objs.messageFirst.style.transform = `translate3d(0, ${calcValues(values.messageFirst_translateY_out, currentYOffset)}%, 0)`;
            }

            if (scrollRatio <= 0.42) {
                // in
                objs.messageSecond.style.opacity = calcValues(values.messageSecond_opacity_in, currentYOffset);
                objs.messageSecond.style.transform = `translate3d(0, ${calcValues(values.messageSecond_translateY_in, currentYOffset)}%, 0)`;
            } else {
                // out
                objs.messageSecond.style.opacity = calcValues(values.messageSecond_opacity_out, currentYOffset);
                objs.messageSecond.style.transform = `translate3d(0, ${calcValues(values.messageSecond_translateY_out, currentYOffset)}%, 0)`;
            }

            if (scrollRatio <= 0.62) {
                // in
                objs.messageThird.style.opacity = calcValues(values.messageThird_opacity_in, currentYOffset);
                objs.messageThird.style.transform = `translate3d(0, ${calcValues(values.messageThird_translateY_in, currentYOffset)}%, 0)`;
            } else {
                // out
                objs.messageThird.style.opacity = calcValues(values.messageThird_opacity_out, currentYOffset);
                objs.messageThird.style.transform = `translate3d(0, ${calcValues(values.messageThird_translateY_out, currentYOffset)}%, 0)`;
            }

            if (scrollRatio <= 0.82) {
                // in
                objs.messageFourth.style.opacity = calcValues(values.messageFourth_opacity_in, currentYOffset);
                objs.messageFourth.style.transform = `translate3d(0, ${calcValues(values.messageFourth_translateY_in, currentYOffset)}%, 0)`;
            } else {
                // out
                objs.messageFourth.style.opacity = calcValues(values.messageFourth_opacity_out, currentYOffset);
                objs.messageFourth.style.transform = `translate3d(0, ${calcValues(values.messageFourth_translateY_out, currentYOffset)}%, 0)`;
            }

            break;

        case 2:
            // console.log('2 play');
            let sequenceSecond = Math.round(calcValues(values.imageSequence, currentYOffset));
            objs.context.drawImage(objs.videoImages[sequenceSecond], 0, 0);
            objs.canvas.style.opacity = calcValues(values.canvasOpacity, currentYOffset);

            if (scrollRatio <= 0.5) {
                // In
                objs.canvas.style.opacity = calcValues(values.canvasOpacity_in, currentYOffset);
                // Out 
                objs.canvas.style.opacity = calcValues(values.canvasOpacity_out, currentYOffset);
            }

            if (scrollRatio <= 0.32) {
                // in
                objs.messageFirst.style.opacity = calcValues(values.messageFirst_opacity_in, currentYOffset);
                objs.messageFirst.style.transform = `translate3d(0, ${calcValues(values.messageFirst_translateY_in, currentYOffset)}%, 0)`;
            } else {
                // out
                objs.messageFirst.style.opacity = calcValues(values.messageFirst_opacity_out, currentYOffset);
                objs.messageFirst.style.transform = `translate3d(0, ${calcValues(values.messageFirst_translateY_out, currentYOffset)}%, 0)`;
            }

            if (scrollRatio <= 0.67) {
                // in
                objs.messageSecond.style.transform = `translate3d(0, ${calcValues(values.messageSecond_translateY_in, currentYOffset)}%, 0)`;
                objs.messageSecond.style.opacity = calcValues(values.messageSecond_opacity_in, currentYOffset);
                objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
            } else {
                // out
                objs.messageSecond.style.transform = `translate3d(0, ${calcValues(values.messageSecond_translateY_out, currentYOffset)}%, 0)`;
                objs.messageSecond.style.opacity = calcValues(values.messageSecond_opacity_out, currentYOffset);
                objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
            }

            if (scrollRatio <= 0.93) {
                // in
                objs.messageThird.style.transform = `translate3d(0, ${calcValues(values.messageThird_translateY_in, currentYOffset)}%, 0)`;
                objs.messageThird.style.opacity = calcValues(values.messageThird_opacity_in, currentYOffset);
                objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
            } else {
                // out
                objs.messageThird.style.transform = `translate3d(0, ${calcValues(values.messageThird_translateY_out, currentYOffset)}%, 0)`;
                objs.messageThird.style.opacity = calcValues(values.messageThird_opacity_out, currentYOffset);
                objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
            }

            break;

        case 3:
            // console.log('3 play');
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
    window.addEventListener('load', () => {
        setLayout();
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
    });
    window.addEventListener('resize', setLayout);

})();