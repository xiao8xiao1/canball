var canBallLevels = function(c, physics, ballControls){
    var levelFuncs = [];    
    var material = new THREE.MeshLambertMaterial( { color: 0x777777 } );
    var canWidth = 2*c.canRad,
        canRad = c.canRad,
        canHeight = c.canHeight,
        ballRad = c.ballRad,
        ballWidth = 2*c.ballRad;
    this.setPara = function(c){
        canWidth = 2*c.canRad
        canRad = c.canRad
        canHeight = c.canHeight
        ballRad = c.ballRad
        ballWidth = 2*c.ballRad
    }
    this.go = function(index){
        if (index < levelFuncs.length)
            levelFuncs[index]();
    }
    function addDesk(h, zPos){
        var desk = new THREE.Mesh(new THREE.BoxGeometry(c.roomWidth, h, canRad*2), material);
        scene.add(desk);
        desk.body = physics.addBody( desk, 0 ); 
        desk.body.position.set(0, h/2, zPos);
        ballControls.arrTarget.push(desk);
    }
    function addStaticBox(w, h, xPos,yPos,zPos){
        var desk = new THREE.Mesh(new THREE.BoxGeometry(w, h, canRad*2), material);
        scene.add(desk);
        desk.body = physics.addBody( desk, 0 ); 
        desk.body.position.set(xPos, yPos+h/2, zPos);
        ballControls.arrTarget.push(desk);
    }
    function addBox(w, h, xPos,yPos,zPos){
        var desk = new THREE.Mesh(new THREE.BoxGeometry(w, h, canRad*2), material);
        scene.add(desk);
        desk.body = physics.addBody( desk, c.massCan*2 ); 
        desk.body.position.set(xPos, yPos+h/2, zPos);
        ballControls.arrTarget.push(desk);
        return desk;
    }
    function addSwingBox(w, h, xPos,yPos,zPos){
        var desk = addBox(w, h, xPos,yPos,zPos)
        var dist = h/2+1
        var ball = new THREE.Mesh(new THREE.SphereGeometry(ballRad, 20, 20), material);
        ball.body = physics.addBody( ball, 0);  scene.add(ball);
        ball.body.position.set(xPos, yPos+h/2+dist+ballRad, zPos);
        ballControls.arrTarget.push(ball);
        desk.body.mass = 100
        physics.world.addConstraint(new CANNON.PointToPointConstraint(desk.body,new CANNON.Vec3(0,dist,0),ball.body));
        desk.body.velocity.set(10,5,0);
        desk.body.linearDamping=0;
        desk.body.angularDamping=0;
    }
    function addCan(xPos,yPos,zPos)
    {
        var can = new THREE.Mesh(new THREE.CylinderGeometry(canRad,canRad,canHeight,20,20,false), material);
        can.body = physics.addBody( can, c.massCan );  scene.add(can);
        can.body.position.set(xPos,yPos+canHeight/2,zPos);
        ballControls.arrTarget.push(can);   
    }
    function addBall(xPos)
    {
        var ball = new THREE.Mesh(new THREE.SphereGeometry(ballRad, 20, 20), material);
        ball.body = physics.addBody( ball, c.massBall );  scene.add(ball);
        ball.body.position.set(xPos, c.groundY+ballRad , c.disdanceHalf);
        ballControls.arrBall.push(ball);
    }
    function addBalls(cnt){
        if (cnt === undefined)
            cnt = Math.floor(c.roomWidth/(2*ballRad))
        var startX = -(cnt*ballRad) + ballRad;
        for (var i = 0; i < cnt; ++i)
            addBall(startX + i* 2*ballRad)
    }
    function pileUpTBox(xPos,yPos,zPos){
        addStaticBox(canRad*2, canHeight*2,    xPos,yPos,zPos)
        addBox(canHeight*2, canRad,  xPos,yPos+canHeight*2,zPos)
        return [xPos-canHeight+canRad, xPos+canHeight-canRad, yPos+canHeight*2+canRad]
    }
    function pileUpTriangle(xCnt, yCnt, xPos,yPos,zPos){
        var interval = 2*canRad/3;
        for (var level = 0; level < yCnt; ++level){
            var xc = xCnt - level;
            var startX = xPos-((xc - 1)*interval + (xc*2*canRad))/2 + canRad;
            for (var i = 0; i < xc; ++i){
                addCan(startX + i*(interval + 2*canRad) , yPos + level*canHeight, zPos);
            }
        }
    }
    function pileUpLine(cnt,  xPos,yPos,zPos){
        for (var level = 0; level < cnt; ++level){
            addCan(xPos , yPos + level*canHeight, zPos);
        }
    }
    function pileUp121(xPos,yPos,zPos){
        addCan(xPos , yPos, zPos);
        addCan(xPos-1.1*canRad, yPos + 1*canHeight, zPos);
        addCan(xPos+1.1*canRad, yPos + 1*canHeight, zPos);
        addCan(xPos , yPos + 2*canHeight, zPos);
    }
    //offsetPercent  (-0.9, 0.9)
    function pileUp111(xPos,yPos,zPos,offset){
        if (offset === undefined)
            offset = (Math.random()*1.8-0.9)*canRad
        addCan(xPos+offset, yPos, zPos);
        addCan(xPos, yPos + 1*canHeight, zPos);
        addCan(xPos+offset, yPos + 2*canHeight, zPos);
    }
    function pileUp221(xPos,yPos,zPos){
        addCan(xPos - 1.2*canRad, yPos, zPos);  addCan(xPos + 1.2*canRad, yPos, zPos); yPos+=canHeight
        addCan(xPos - 1.8*canRad, yPos, zPos);  addCan(xPos + 1.8*canRad, yPos, zPos); yPos+=canHeight
        addCan(xPos , yPos, zPos);
    }
    ////////////////////////////////
    levelFuncs.push(function()
    {
        var zPos = -c.disdanceHalf+canRad, yPos=0;
        addDesk(c.deskHight, zPos); yPos+=c.deskHight;
        pileUpTriangle(4,3,  0,yPos,zPos)
        addBalls(3)
    })    
    levelFuncs.push(function()
    {
        var zPos = -c.disdanceHalf+canRad, yPos=0;
        addDesk(c.deskHight, zPos); yPos+=c.deskHight;
        pileUp111(0, yPos,zPos, 0)
        pileUp111(-canWidth-0.5*ballWidth, yPos,zPos,-0.2*canWidth)
        pileUp111( canWidth+0.5*ballWidth, yPos,zPos,0.2*canWidth)
        addBalls(3)
    })
    levelFuncs.push(function()
    {
        var zPos = -c.disdanceHalf+canRad, yPos=0;
        addDesk(c.deskHight, zPos); yPos+=c.deskHight;
        pileUp221(0, yPos,zPos)
        addBalls(3)
    })
    levelFuncs.push(function()
    {
        var zPos = -c.disdanceHalf+canRad;
        addDesk(c.deskHight, zPos)
        var l, r, h;
        [l,r,h]  = pileUpTBox(0,c.deskHight,zPos)
        addCan(l, h, zPos)
        addCan(r, h, zPos)
        addBalls(6)
        addSwingBox(canRad*2, canHeight*2,  0,c.deskHight, zPos+canRad*4)   
    })
    levelFuncs.push(function()
    {
        addDesk(c.deskHight, -c.disdanceHalf+canRad)
        pileUp111( 0,        c.deskHight,-c.disdanceHalf+canRad)
        pileUp111( 4*canRad,c.deskHight,-c.disdanceHalf+canRad, -0.9)
        pileUp111(-4*canRad,c.deskHight,-c.disdanceHalf+canRad,  0.9)
        addBalls(6)
    })
    levelFuncs.push(function()
    {
        addDesk(c.deskHight, -c.disdanceHalf+canRad)
        pileUpLine(3, 0,c.deskHight,-c.disdanceHalf+canRad)
        addBalls(6)
    })
    levelFuncs.push(function()
    {
        addDesk(c.deskHight, -c.disdanceHalf+canRad)
        pileUp121(0,c.deskHight,-c.disdanceHalf+canRad)
        addBalls(6)
    })
    levelFuncs.push(function()
    {
        addDesk(c.deskHight, -c.disdanceHalf+canRad)
        pileUpTriangle(3,3, 0,c.deskHight,-c.disdanceHalf)
        addBalls(6)
    })
    levelFuncs.push(function()
    {
        addDesk(c.deskHight*2, -c.disdanceHalf+canRad)
        pileUpTriangle(4,4, 0,c.deskHight*2,-c.disdanceHalf+canRad)
        addDesk(c.deskHight, -c.disdanceHalf+canRad+3*canRad)
        pileUpTriangle(3,3, 0,c.deskHight,-c.disdanceHalf+canRad+3*canRad)
        addBalls(6)
    })
    } //end Levels