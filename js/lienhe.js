window.onload = function () {
    KhoiTao();

    // add tags (keywords) to search box
    var Tags = ["Samsung", "iPhone", "Huawei", "Oppo", "Mobi"];
    for (var t of Tags) AddTags(t, "index.php?search=" + t);
}

function Nguoidung() {
    //check full name
    var Hoten = document.formlh.ht.value;
    //check phone number
    var Dienthoai = document.formlh.sdt.value;

    //check full name
    if (!CheckName(Hoten)) {
        addAlertBox('Invalid name.', '#f55', '#000', 3000);
        formlh.ht.focus();
        return false;
    }
    //-------
    else if (!CheckPhone(Dienthoai)) {
        addAlertBox('Invalid phone number.', '#f55', '#000', 3000);
        return false;
    }

    addAlertBox('Sent successfully. Thank you for your feedback.', '#5f5', '#000', 5000); // thank you
    // document.formlh.reset(); // clear
    return false; // exit
}

function CheckName(Str) {
    for (var i = 0; i < Str.length; i++) {
        if (Number(Str[i])) return false;
    }
    return true;
}

function CheckPhone(Phone) {
    for(var i =0 ; i< Phone.length ;i++)
    {
        if(Phone.charAt(i)<"0" || Phone.charAt(i)>"9")
            return false;
    }
    return true;
}

function CheckPhone2(Phone) {
    var Phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (Phone.match(Phoneno)) return true;

    return false;
}