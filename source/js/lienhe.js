window.onload = function () {
    khoiTao();

    // add tags (keywords) to search box
    var tags = ["Samsung", "iPhone", "Huawei", "Oppo", "Mobi"];
    for (var t of tags) addTags(t, "index.php?search=" + t);
}

function nguoidung() {
    //check full name
    var hoten = document.formlh.ht.value;
    //check phone number
    var dienthoai = document.formlh.sdt.value;

    //check full name
    if (!checkName(hoten)) {
        addAlertBox('Invalid name.', '#f55', '#000', 3000);
        formlh.ht.focus();
        return false;
    }
    //-------
    else if (!checkPhone(dienthoai)) {
        addAlertBox('Invalid phone number.', '#f55', '#000', 3000);
        return false;
    }

    addAlertBox('Sent successfully. Thank you for your feedback.', '#5f5', '#000', 5000); // thank you
    // document.formlh.reset(); // clear
    return false; // exit
}

function checkName(str) {
    for (var i = 0; i < str.length; i++) {
        if (Number(str[i])) return false;
    }
    return true;
}

function checkPhone(phone) {
    for(var i =0 ; i< phone.length ;i++)
    {
        if(phone.charAt(i)<"0" || phone.charAt(i)>"9")
            return false;
    }
    return true;
}

function checkPhone2(phone) {
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (phone.match(phoneno)) return true;

    return false;
}