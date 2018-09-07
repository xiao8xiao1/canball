var canBallLevels = function(c, physics, ballControls){
    var levelFuncs = [];
    var material = new THREE.MeshLambertMaterial( { color: 0x777777 } );
    this.go = function(index){
        if (index < levelFuncs.length)
            levelFuncs[index]();
    }
    function addDesk(h, zPos){
        var desk = new THREE.Mesh(new THREE.BoxGeometry(c.roomWidth, h, c.canRad*2), material);
        scene.add(desk);
        desk.body = physics.addBody( desk, 0 ); 
        desk.body.position.set(0, h/2, zPos);
        ballControls.arrTarget.push(desk);
    }
    function addStaticBox(w, h, xPos,yPos,zPos){
        var desk = new THREE.Mesh(new THREE.BoxGeometry(w, h, c.canRad*2), material);
        scene.add(desk);
        desk.body = physics.addBody( desk, 0 ); 
        desk.body.position.set(xPos, yPos+h/2, zPos);
        ballControls.arrTarget.push(desk);
    }
    function addBox(w, h, xPos,yPos,zPos){
        var desk = new THREE.Mesh(new THREE.BoxGeometry(w, h, c.canRad*2), material);
        scene.add(desk);
        desk.body = physics.addBody( desk, c.massCan*2 ); 
        desk.body.position.set(xPos, yPos+h/2, zPos);
        ballControls.arrTarget.push(desk);
        return desk;
    }
    function addSwingBox(w, h, xPos,yPos,zPos){
        var desk = addBox(w, h, xPos,yPos,zPos)
        var dist = h/2+1
        var ball = new THREE.Mesh(new THREE.SphereGeometry(c.ballRad, 20, 20), material);
        ball.body = physics.addBody( ball, 0);  scene.add(ball);
        ball.body.position.set(xPos, yPos+h/2+dist+c.ballRad, zPos);
        ballControls.arrTarget.push(ball);
        desk.body.mass = 100
        physics.world.addConstraint(new CANNON.PointToPointConstraint(desk.body,new CANNON.Vec3(0,dist,0),ball.body));
        desk.body.velocity.set(10,5,0);
        desk.body.linearDamping=0;
        desk.body.angularDamping=0;
    }
    function addCan(xPos,yPos,zPos)
    {
        var can = new THREE.Mesh(new THREE.CylinderGeometry(c.canRad,c.canRad,c.canHeight,20,20,false), material);
        can.body = physics.addBody( can, c.massCan );  scene.add(can);
        can.body.position.set(xPos,yPos+c.canHeight/2,zPos);
        ballControls.arrTarget.push(can);   
    }
    function addBall(xPos)
    {
        var ball = new THREE.Mesh(new THREE.SphereGeometry(c.ballRad, 20, 20), material);
        ball.body = physics.addBody( ball, c.massBall );  scene.add(ball);
        ball.body.position.set(xPos, c.groundY+c.ballRad , c.disdanceHalf);
        ballControls.arrBall.push(ball);
    }
    function addBalls(cnt){
        if (cnt === undefined)
            cnt = Math.floor(c.roomWidth/(2*c.ballRad))
        var startX = -(cnt*c.ballRad) + c.ballRad;
        for (var i = 0; i < cnt; ++i)
            addBall(startX + i* 2*c.ballRad)
    }
    function pileUpTBox(xPos,yPos,zPos){
        addStaticBox(c.canRad*2, c.canHeight*2,    xPos,yPos,zPos)
        addBox(c.canHeight*2, c.canRad,  xPos,yPos+c.canHeight*2,zPos)
        return [xPos-c.canHeight+c.canRad, xPos+c.canHeight-c.canRad, yPos+c.canHeight*2+c.canRad]
    }
    function pileUpTriangle(xCnt, yCnt, xPos,yPos,zPos){
        var interval = 2*c.canRad/3;
        for (var level = 0; level < yCnt; ++level){
            var xc = xCnt - level;
            var startX = xPos-((xc - 1)*interval + (xc*2*c.canRad))/2 + c.canRad;
            for (var i = 0; i < xc; ++i){
                addCan(startX + i*(interval + 2*c.canRad) , yPos + level*c.canHeight, zPos);
            }
        }
    }
    function pileUpLine(cnt,  xPos,yPos,zPos){
        for (var level = 0; level < cnt; ++level){
            addCan(xPos , yPos + level*c.canHeight, zPos);
        }
    }
    function pileUp121(xPos,yPos,zPos){
        addCan(xPos , yPos, zPos);
        addCan(xPos-1.1*c.canRad, yPos + 1*c.canHeight, zPos);
        addCan(xPos+1.1*c.canRad, yPos + 1*c.canHeight, zPos);
        addCan(xPos , yPos + 2*c.canHeight, zPos);
    }
    //offsetPercent  (-0.9, 0.9)
    function pileUp111(xPos,yPos,zPos,offsetPercent){
        if (offsetPercent === undefined)
            offsetPercent = (Math.random()*1.8-0.9)
        addCan(xPos , yPos, zPos);
        addCan(xPos+offsetPercent*c.canRad, yPos + 1*c.canHeight, zPos);
        addCan(xPos , yPos + 2*c.canHeight, zPos);
    }
    ////////////////////////////////
    levelFuncs.push(function()
    {
        var zPos = -c.disdanceHalf+c.canRad;
        // addDesk(c.deskHight, zPos)
        // var l, r, h;
        // [l,r,h]  = pileUpTBox(0,c.deskHight,zPos)
        // addCan(l, h, zPos)
        // addCan(r, h, zPos)
        addBalls()
        addSwingBox(c.canRad*2, c.canHeight*2,  0,c.deskHight, zPos+c.canRad*4)   
    })
    levelFuncs.push(function()
    {
        addDesk(c.deskHight, -c.disdanceHalf+c.canRad)
        pileUp111( 0,        c.deskHight,-c.disdanceHalf+c.canRad)
        pileUp111( 4*c.canRad,c.deskHight,-c.disdanceHalf+c.canRad, -0.9)
        pileUp111(-4*c.canRad,c.deskHight,-c.disdanceHalf+c.canRad,  0.9)
        addBalls()
    })
    levelFuncs.push(function()
    {
        addDesk(c.deskHight, -c.disdanceHalf+c.canRad)
        pileUpLine(3, 0,c.deskHight,-c.disdanceHalf+c.canRad)
        addBalls()
    })
    levelFuncs.push(function()
    {
        addDesk(c.deskHight, -c.disdanceHalf+c.canRad)
        pileUp121(0,c.deskHight,-c.disdanceHalf+c.canRad)
        addBalls()
    })
    levelFuncs.push(function()
    {
        addDesk(c.deskHight, -c.disdanceHalf+c.canRad)
        pileUpTriangle(3,3, 0,c.deskHight,-c.disdanceHalf)
        addBalls()
    })
    levelFuncs.push(function()
    {
        addDesk(c.deskHight*2, -c.disdanceHalf+c.canRad)
        pileUpTriangle(4,4, 0,c.deskHight*2,-c.disdanceHalf+c.canRad)
        addDesk(c.deskHight, -c.disdanceHalf+c.canRad+3*c.canRad)
        pileUpTriangle(3,3, 0,c.deskHight,-c.disdanceHalf+c.canRad+3*c.canRad)
        addBalls()
    })
    } //end Levels