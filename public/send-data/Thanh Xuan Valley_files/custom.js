$("#RegisterContact").on("submit", function (e) {
        e.preventDefault();
        //call external service
    var url = "/Contact/SubmitForm";
        var formdata = (window.FormData) ? new FormData(this) : null;
        var fdata = (formdata !== null) ? formdata : $form.serialize();
        $("#btnRegisterContact").attr("disabled", true);

        //get authorization keys.
        $.ajax({
            type: "POST",
            url: url,
            data: fdata,
            processData: false,
            contentType: false,
            success: function (data) {
                $("#btnRegisterContact").attr("disabled", false);
                alert(data.Message);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("Error");
                $("#btnRegisterContact").attr("disabled", false);
                alert(data.Message);
            }
        });

    });