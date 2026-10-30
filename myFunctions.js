
$(document).ready(function() {

   
    $(".toggle-details").change(function() {
        var targetRowId = $(this).val();
        if ($(this).is(":checked")) {
            $("#" + targetRowId).fadeIn(250);
        } else {
            $("#" + targetRowId).fadeOut(200);
        }
    });

    
    $("#carsTable tbody tr.car-row").hover(
        function() {
            $(this).css("background-color", "#eaf2f8");
        },
        function() {
            $(this).css("background-color", "");
        }
    );

});


function showBookingForm() {
    var checkboxes = document.getElementsByName("selectedCar");
    var hasSelection = false;
    var i;

    for (i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            hasSelection = true;
            break;
        }
    }

    if (!hasSelection) {
        alert("يرجى اختيار سيارة واحدة على الأقل من عمود (اختيار) قبل الضغط على زر متابعة.");
        return;
    }

    $("#bookingSection").slideDown(350);
}


function parseValidDate(dateStr) {
    var datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dateStr)) {
        return null;
    }

    var parts = dateStr.split("-");
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var day = parseInt(parts[2], 10);

    if (month < 1 || month > 12 || day < 1 || day > 31) {
        return null;
    }

    var dateObj = new Date(year, month - 1, day);
    if (dateObj.getFullYear() !== year || (dateObj.getMonth() + 1) !== month || dateObj.getDate() !== day) {
        return null;
    }

    return dateObj;
}


function validateAndCalculate() {
    var checkboxes = document.getElementsByName("selectedCar");
    var selectedCars = [];
    var i;

    for (i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            selectedCars.push({
                model: checkboxes[i].getAttribute("data-model"),
                price: parseFloat(checkboxes[i].getAttribute("data-price"))
            });
        }
    }

    if (selectedCars.length === 0) {
        alert("يرجى اختيار سيارة واحدة على الأقل من الجدول.");
        return false;
    }

    var fullName = document.getElementById("fullName").value.trim();
    var nationalId = document.getElementById("nationalId").value.trim();
    var startDateStr = document.getElementById("startDate").value.trim();
    var endDateStr = document.getElementById("endDate").value.trim();
    var mobile = document.getElementById("mobileNumber").value.trim();
    var email = document.getElementById("emailAddress").value.trim();


    if (fullName !== "") {
        var arabicNameRegex = /^[\u0621-\u064A\s]+$/;
        if (!arabicNameRegex.test(fullName)) {
            alert("خطأ في الاسم الكامل: يجب إدخال أحرف هجائية عربية ومسافات فقط.");
            document.getElementById("fullName").focus();
            return false;
        }
    }

   
    if (nationalId === "") {
        alert("الرقم الوطني إلزامي الإدخال، يرجى تعبئة هذا الحقل.");
        document.getElementById("nationalId").focus();
        return false;
    }
    var nationalIdRegex = /^(0[1-9]|1[0-4])\d{9}$/;
    if (!nationalIdRegex.test(nationalId)) {
        alert("خطأ في الرقم الوطني: يجب أن يتألف من 11 خانة رقمية وأن ترمز أول خانتين إلى المحافظة (من 01 إلى 14).");
        document.getElementById("nationalId").focus();
        return false;
    }

   
    if (startDateStr === "" || endDateStr === "") {
        alert("تاريخا بداية التأجير ونهاية التأجير إلزاميا الإدخال.");
        return false;
    }

    var startDate = parseValidDate(startDateStr);
    if (startDate === null) {
        alert("خطأ في تاريخ بداية التأجير: يرجى إدخال تاريخ صحيح بصيغة yyyy-mm-dd (مثال: 2026-11-01).");
        document.getElementById("startDate").focus();
        return false;
    }

    var endDate = parseValidDate(endDateStr);
    if (endDate === null) {
        alert("خطأ في تاريخ نهاية التأجير: يرجى إدخال تاريخ صحيح بصيغة yyyy-mm-dd (مثال: 2026-11-10).");
        document.getElementById("endDate").focus();
        return false;
    }

   var timeDiff = endDate.getTime() - startDate.getTime();
    var rentalDays = Math.round(timeDiff / (1000 * 3600 * 24));
    if (rentalDays <= 0) {
        alert("خطأ في التواريخ: يجب أن يكون تاريخ نهاية التأجير لاحقاً لتاريخ بداية التأجير.");
        document.getElementById("endDate").focus();
        return false;
    }

 
    if (mobile !== "") {
        var syrianMobileRegex = /^09[345689]\d{7}$/;
        if (!syrianMobileRegex.test(mobile)) {
            alert("خطأ في رقم الموبايل: يجب أن يطابق شبكتي Syriatel (093, 098, 099) أو MTN (094, 095, 096) ويتكون من 10 أرقام.");
            document.getElementById("mobileNumber").focus();
            return false;
        }
    }

   
    if (email !== "") {
        var emailRegex = /^[\w._%+\-]+@[\w.\-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            alert("خطأ في البريد الإلكتروني: يرجى إدخال بريد إلكتروني بصيغة صحيحة (مثال: user@domain.com).");
            document.getElementById("emailAddress").focus();
            return false;
        }
    }

 
    var totalBeforeDiscount = 0;
    var carsSummaryText = "";
    var carsSummaryHtml = "<ul>";

    for (i = 0; i < selectedCars.length; i++) {
        var carCost = selectedCars[i].price * rentalDays;
        totalBeforeDiscount += carCost;
        carsSummaryText += "- " + selectedCars[i].model + " (عدد أيام التأجير: " + rentalDays + " يوم، الكلفة: " + carCost + " ل.س)\n";
        carsSummaryHtml += "<li><strong>" + selectedCars[i].model + "</strong> — عدد أيام التأجير: " + rentalDays + " يوم — الكلفة الفرعية: " + carCost + " ل.س</li>";
    }
    carsSummaryHtml += "</ul>";

    var discountAmount = 0;
    var discountNote = "لا يوجد خصم (مدة التأجير 7 أيام أو أقل)";
    if (rentalDays > 7) {
        discountAmount = totalBeforeDiscount * 0.10;
        discountNote = "تم تطبيق خصم 10% لتجاوز مدة التأجير 7 أيام (قيمة الخصم: " + discountAmount + " ل.س)";
    }

    var finalTotal = totalBeforeDiscount - discountAmount;

  
    var alertMessage = "تم التحقق من صحة البيانات بنجاح!\n\n" +
        "السيارات المختارة:\n" + carsSummaryText + "\n" +
        "عدد أيام التأجير لكل سيارة: " + rentalDays + " يوم\n" +
        "المبلغ قبل الخصم: " + totalBeforeDiscount + " ل.س\n" +
        "حالة الخصم: " + discountNote + "\n" +
        "المبلغ الإجمالي النهائي: " + finalTotal + " ل.س";

    var resultDiv = document.getElementById("resultBox");
    resultDiv.innerHTML = "<h3>نتيجة طلب الحجز الإلكتروني</h3>" +
        "<p><strong>السيارات المختارة:</strong></p>" + carsSummaryHtml +
        "<p><strong>عدد أيام التأجير لكل سيارة:</strong> " + rentalDays + " يوم</p>" +
        "<p><strong>المجموع قبل الخصم:</strong> " + totalBeforeDiscount + " ل.س</p>" +
        "<p><strong>الخصم:</strong> " + discountNote + "</p>" +
        "<p><strong>المبلغ الإجمالي النهائي المطلوب:</strong> " + finalTotal + " ل.س</p>";

    $("#resultBox").fadeIn(300);
    alert(alertMessage);

    return false;
}


function exitWebsite() {
    var confirmExit = confirm("هل أنت متأكد من رغبتك في الخروج من الموقع؟");
    if (confirmExit) {
        alert("شكراً لزيارتكم مكتب الشام لتأجير السيارات.");
        window.location.href = "home.html";
    }
}
