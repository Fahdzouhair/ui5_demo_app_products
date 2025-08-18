sap.ui.define(['sap/ui/core/UIComponent'],
    (UIComponent,) => {
        'use strict'

        return UIComponent.extend('ui5.demo.app.webapp.Component', {
            metadata: {
                interface: ["sap.ui.core.IAsyncContentCreation"],
                manifest: "json"
            },

            init: function () {
                //init parent 
                UIComponent.prototype.init.apply(this, arguments)

            }
        })


    })