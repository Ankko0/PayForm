$(document).ready(function () {
    HandleWrongValue($('#clientType')[0]); // выделение селектора для выбора типа клиента
    $('#clientType').change(ClientTypeChange);
    $('#nameInput').change(LengthValidator);
    $('#surnameInput').change(LengthValidator);
    $('#simpleTax').change(SimpleTaxChecker);
    $('#taxNumber').change(TaxNumberValidator);
    $('#phoneNumber').change(PhoneNumberValidator);
    $('#moneyAmount').change(PriceValidator);
    $('#phoneNumber').mask('+7(000) 000-0000', {placeholder: "+7(___) ____-____"});
    $('#moneyAmount').mask('#.00', {reverse: true});
    $('#total').mask('#,##0.00', {reverse: true});
    $('#submit').click(FinalValidation);

})

/* Ограничения для validate.js */
var constraints = {
    name: {
        length: {maximum: 15, minimum: 2},
        format: {pattern: "[a-zA-Zа-яА-Я]+"}
    }
}

/* Тип клиента (юр или физ лицо). */
var clientType;

/* Изменение типа клиента на Физическое лицо или юр. лицо. */
function ClientTypeChange() {
    clientType = this.value;
    if (clientType === 'Физическое лицо') {
        $('#tax').val(13);
        $('.entityTypeDiv').css('display', 'none');
        $('#simpleTaxDiv').css('display', 'none');
        $('#taxNumber').mask('0000 0000 0000');
        document.getElementById('submit').disabled = false;
        HandleRightValue(this);
    } else if (clientType === 'Юридическое лицо') {
        $('#tax').val(17);
        $('.entityTypeDiv').css('display', 'block');
        $('#simpleTaxDiv').css('display', 'block');
        $('#taxNumber').mask('0000 0000 00');
        document.getElementById('submit').disabled = false;
        HandleRightValue(this);
    } else {
        HandleWrongValue(this);
        document.getElementById('submit').disabled = true;
    }

}

/* Валидация длины имени или фамилии. */
function LengthValidator() {
    let errors = validate({name: this.value}, constraints);
    if (errors == null) {
        HandleRightValue(this);
        return true;
    } else {
        HandleWrongValue(this);
        return false;
    }
}

/* Переключатель для упрощенного налогообложения для юр. лиц. */
function SimpleTaxChecker() {
    if ($(this).is(':checked')) {
        $('#taxNumber').val('');
        $('#taxNumber').prop('readonly', true);
    } else {
        $('#taxNumber').prop('readonly', false);
    }

}

/* Валидация номера ИНН. */
function TaxNumberValidator() {
    let taxNumberDiv = $('#taxNumber');
    if (clientType === 'Физическое лицо' && taxNumberDiv.cleanVal().length === 12) {
        HandleRightValue(taxNumberDiv[0]);
        return true;
    } else if (clientType === 'Юридическое лицо' && (taxNumberDiv.cleanVal().length === 10 || $('#simpleTax').is(':checked') )) {
        HandleRightValue(taxNumberDiv[0]);
        return true;
    } else {
        HandleWrongValue(taxNumberDiv[0]);
        return false;
    }
}

/* Валидация телефонного номера. */
function PhoneNumberValidator() {
    let phoneDiv = $('#phoneNumber');
    if (phoneDiv.cleanVal().length === 10 ) {
        HandleRightValue(phoneDiv[0]);
        return true;
    }
    else {
        HandleWrongValue(phoneDiv[0]);
        return false;
    }
}

/* Валидация введеной цены. */
function PriceValidator() {
    let moneyDiv = $('#moneyAmount');
    let moneyAmount = parseFloat(moneyDiv.val());
    if (moneyAmount > 0) {
        HandleRightValue(moneyDiv[0]);
        CalcFinalPrice(moneyAmount);
        return true;
    } else {
        HandleWrongValue(moneyDiv[0]);
        return false;
    }
}

/* Рассчёт конечной стоимости по формуле  "итог" = "Сумма платежа" * (1 + "НДС"/100). */
function CalcFinalPrice(sum) {
    let value = sum * (1 + parseFloat(parseInt($('#tax').val()) / 100));
    let roundValue = parseFloat(Math.round(value * 100) / 100);
    $('#total').val($('#total').masked(roundValue));

}

/* Финальная валидация перед отправкой формы. */
function FinalValidation() {
    if (LengthValidator.apply(document.getElementById('nameInput')) &
        LengthValidator.apply(document.getElementById('surnameInput')) &
        TaxNumberValidator() &
        PhoneNumberValidator() &
        PriceValidator()) {
        $('#alert-success').css('display', 'block');
        $('#alert-danger').css('display', 'none');
    }
    else {
        $('#alert-success').css('display', 'none');
        $('#alert-danger').css('display', 'block');
    }
}

/* Обработка невалидных данных. Выделение неправильного инпута красным цветом. Можно добавить логику блокировки кнопки и т.д. */
function HandleWrongValue(item) {
    item.style.borderColor = '#ec0303';
}

/* Обработка валидных данных. Стандартный цвет инпута.*/
function HandleRightValue(item) {
    item.style.borderColor = '#D4DCE0';
}