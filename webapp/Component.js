sap.ui.define(['sap/ui/core/UIComponent',
                'ui5/demo/app/model/models'],
    (UIComponent,models) => {
        'use strict'

        return UIComponent.extend('ui5.demo.app.webapp.Component', {
            metadata: {
                interface: ["sap.ui.core.IAsyncContentCreation"],
                manifest: "json"
            },

            init: function () {
                //init parent 
                UIComponent.prototype.init.apply(this, arguments)
                this.setModel(models.createProductModel(),"input")
                this.setModel(models.validatePeoductModel(),"validate")
            }
        })


    })