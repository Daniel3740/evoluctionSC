require([
        "dojo/dnd/Moveable",
        "dojo/dom",
        "dojo/on",
        "dojo/domReady!",
        "dojox/grid/EnhancedGrid",
        "dojox/grid/enhanced/plugins/Pagination",
        "dojo/data/ItemFileWriteStore",
        "dojo/request"
    ],
    function (Moveable, dom, on, request) {
        let visible = false;
        var dnd = new Moveable(dom.byId("gridDiv"));

        on(dom.byId("users"), "click", async function () {
            if (!visible) {

                var datos = await require('dojo/request').post("/api/login/getusers", {
                    data: {
                        token: sessionStorage.getItem('token')
                    }
                }).then(function (data) {
                    datosUsers = JSON.parse(data);
                    console.log("The server returned: ", datosUsers);
                    return datosUsers
                });

                visible = true;
                dom.byId("gridDiv").style.visibility = "";
                console.log("Datos a ser enviados al store: ", datos);

                /*set up data store*/
                var data = {
                    identifier: 'id',
                    items: datos
                };
                var store = new dojo.data.ItemFileWriteStore({
                    data: data
                });

                /*set up layout*/
                var layout = [
                    [{
                            name: 'ID',
                            field: 'id',
                            width: '50px'
                        },
                        {
                            name: 'NOMBRE',
                            field: 'username'
                        },
                        {
                            name: 'APELLIDO',
                            field: 'lastname',
                            width: "150px"
                        },
                        {
                            name: 'ESTADO',
                            field: 'estado',
                            width: "100px"
                        }
                    ]
                ];
                try {
                    /*create a new grid:*/
                    var grid = new dojox.grid.EnhancedGrid({
                        id: 'grid',
                        store: store,
                        structure: layout,
                        rowSelector: '20px',
                        plugins: {
                            pagination: {
                                pageSizes: ["10", "20", "30", "All"],
                                description: true,
                                sizeSwitch: true,
                                pageStepper: true,
                                gotoButton: true,
                                /*page step to be displayed*/
                                maxPageStep: 4,
                                /*position of the pagination bar*/
                                position: "bottom"
                            }
                        }
                    }, document.createElement('div'));


                    dojo.byId("gridDiv").appendChild(grid.domNode);
                    grid.startup();
                } catch (error) {

                }

            } else {
                dom.byId("gridDiv").style.visibility = "hidden";
                visible = false;
            }
        });
    });