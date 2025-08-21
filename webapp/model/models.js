sap.ui.define(["sap/ui/model/json/JSONModel",
], (JSONModel) => {
    return {
        createProductModel() {
            return new JSONModel({
                Name: "",
                Category: "",
                Price: 0,
                ReleaseDate: null,
                DiscontinuedDate: null
            })
        }
    }
})