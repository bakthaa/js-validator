"use strict";

function throwErrIfNull(obj, err) {

    if (!obj) {

        throw new Error(err ? err : 'Object undefined.');
    }
}
let validateFn = (function() {
    /* return true if not valid */
    return {
        REQUIRED: function(value) {
            return (!value || value.trim().length === 0);
        },
        SIZE: function(size) {
            return function(value) {
                return (value && value.length !== size);
            }
        },
        MIN: function(size) {
            return function(value) {
                return (value && value.length < size);
            }
        },
        MAX: function(size) {
            return function(value) {
                return (value && value.length > size);
            }
        },
        REGEX: function(regexObj) {
            return function(value) {
                return (value && !regexObj.test(value));
            }
        },
        LT: function(num) { // less than
            return function(value) {
                const _n = Number(value);
                return isNaN(_n) ? true : (_n < num);
            }
        },
        GT: function(num) { // greater than
            return function(value) {
                const _n = Number(value);
                return isNaN(_n) ? true : (_n > num);
            }
        }
    }
})();

let formatFn = (function() {
    function format(format) {
        return function(value) {
            return format.regex.test(value) ? value.replace(format.regex, format.fmt) : value;
        }
    }
    return {
        PHONE: format({
            regex: /^(\d{3})(\d{3})(\d{1,4})$/,
            fmt: '($1) $2-$3'
        }),
        CLAIM_NUM: format({
            regex: /^([0-9]{2})([a-zA-Z0-9]{4})([a-zA-Z0-9]{3})$/,
            fmt: '$1-$2-$3'
        }),
        CURRENCY: function(value) {
            return Number(value) === 0 ? '' : '$' + Number(value).format(2);
        },
    }
})();

const InputControl = (function() {

    const STR_CLASS = 'class';
    const STR_HAS_ERROR = ' has-error';
    const STR_HELP_BLOCK = '.help-block';
    const STR_PARENT_ELE_CLS = '.form-group';

    function removeAllChildren(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    function hasError(validator, value) {

        let _error = {

            valid: true
        };
        for (var i = 0; i < validator.length; i++) {

            if (validator[i].fn(value)) {
                _error = {

                    valid: false,
                    msg: validator[i].msg
                };
                break;
            }
        }
        return _error;
    }

    function unFomatFn(allowOnly) {
        return function(value) {
            return (value) ? ('' + value).replace(allowOnly, '') : '';
        }
    }

    function setMaxLength(length) {
        return function(value) {
            return (value) ? value.substring(0, length) : '';
        }
    }

    function fieldValidator(validator, parent, helpBlock, format, unFomat) {

        if (validator) {
            removeAllChildren(helpBlock);
            const _sClass = parent.getAttribute(STR_CLASS);
            const _hasErrorIdx = _sClass.indexOf(STR_HAS_ERROR);
            const _value = (unFomat) ? unFomat(this.value) : this.value;
            const _valid = hasError(validator, _value);
            this.valid = _valid.valid;
            if (_valid.valid) {
                if (-1 < _hasErrorIdx) {
                    parent.setAttribute(STR_CLASS, _sClass.substring(0, _hasErrorIdx));
                }
                if (format) {
                    this.value = format(this.value);
                }
            } else {
                if (-1 === _hasErrorIdx) {
                    parent.setAttribute(STR_CLASS, _sClass + STR_HAS_ERROR);
                }
                helpBlock.appendChild(document.createTextNode(_valid.msg));
            }
        }
    }

    return function(form, fields, emitter) {

        throwErrIfNull(fields, 'fields not found!');
        const _inputName = fields.inputName;
        const _validator = fields.validator;
        const _formatFn = fields.formatFn;
        const _unFomatFn = fields.allowOnly && unFomatFn(fields.allowOnly);
        const _maxLengthFn = fields.maxLength && setMaxLength(fields.maxLength);
        throwErrIfNull(_inputName, 'inputName not found!');
        const _input = form[_inputName];
        throwErrIfNull(_input, 'form name ' + _inputName + ' not found');
        const _parent = _input.closest(STR_PARENT_ELE_CLS);
        const _helpBlock = _parent.querySelector(STR_HELP_BLOCK);
        throwErrIfNull(_helpBlock, 'help-block not found for ' + _inputName);
        const _fieldValidator = fieldValidator.bind(_input, _validator, _parent, _helpBlock, _formatFn, _unFomatFn);
        _input.addEventListener('blur', _fieldValidator);
        const _onTextChangeEvents = [];
        if (_maxLengthFn) {
            _onTextChangeEvents.push(_maxLengthFn);
        }
        if (_unFomatFn) {

            _onTextChangeEvents.push(_unFomatFn);
            const _clearFormat = function() {
                this.value = _unFomatFn(this.value);
            }
            _input.addEventListener('focus', _clearFormat);
        }
        _onTextChangeEvents.forEach(function(event) {
            _input.addEventListener('keyup', function() {
                this.value = event(this.value);
            });
        })
        return {
            input: _input,
            fieldValidatorFn: _fieldValidator
        };
    }
})();

const FormControl = (function() {
    function getForm(name) {
        const _form = document.forms[name];
        throwErrIfNull(_form, name + ' not found.')
        return _form;
    }

    function isValid(inputControls) {

        return !(inputControls.some(function(ctrl) {

            return (!ctrl.input.valid);
        }));
    }

    function populateError(inputControls) {

        inputControls.forEach(function(ctrl) {
            ctrl.fieldValidatorFn();
        });
    }

    return function(option) {
        throwErrIfNull(option, 'option not found!')
        const _controlls = [];
        const _form = getForm(option.name);
        if (option.controls) {

            option.controls.forEach(function(control) {

                try {
                    _controlls.push(new InputControl(_form, control));
                } catch (e) {
                    console.warn(e);
                }
            });

        }
        _form.addEventListener("submit", function(evt) {
            if (isValid(_controlls)) {
                return true;
            } else {
                populateError(_controlls);
                evt.preventDefault();
                return false;
            }
        }, true);
        console.log("FormControl loaded..");
        return {
            controlls: _controlls
        };
    }
})();
