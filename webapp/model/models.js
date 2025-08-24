sap.ui.define(["sap/ui/model/json/JSONModel",
], (JSONModel) => {
    return {
        createProductModel() {
            return new JSONModel({
                Name: "",
                Category: "",
                Price: 0,
                Currency : "EUR",
                ReleaseDate: null,
                DiscontinuedDate: null
            })
        }, 
        validatePeoductModel(){
            return new JSONModel({
                Name: true,
                Category: true,
                Price: true,
                ReleaseDate: true,
                DiscontinuedDate: true
            })
        }
    }
})