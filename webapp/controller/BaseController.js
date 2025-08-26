sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],(Controller, History)=>{
    'use strict'

    return Controller.extend("ui5.demo.app.controller.BaseController",{

       
        onNavBack: function(oEvent){
            const oHistory = History.getInstance()
            
            const sPreviousHash = oHistory.getPreviousHash()
            const sRouter = sap.ui.core.UIComponent.getRouterFor(this)
            
            console.log(sPreviousHash)
            
            if(sPreviousHash !== undefined){
                window.history.go(-1)
            }else{
                sRouter.navTo('Home',{} , true)
            }
        },
        getRouter: function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        }
    })
})