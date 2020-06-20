"use strict";
const claimForm = {
    name: 'vc-form',
    controls: [{
        inputName: 'claim-num',
        maxLength: 9,
        validator: [{
                fn: validateFn.REQUIRED,
                msg: 'Claim Number is required'
            },
            {
                fn: validateFn.SIZE(9),
                msg: 'Please enter a valid 9 character.'
            },
            {
                fn: validateFn.REGEX(/^[0-9]{2}[a-zA-Z0-9]{4}[a-zA-Z0-9]{3}$/),
                msg: 'Please enter a valid 9 character.'
            }
        ],
        allowOnly: /[\W_]+/g,
        formatFn: formatFn.CLAIM_NUM
    }, {
        inputName: 'phone-number',
        maxLength: 10,
        validator: [{
                fn: validateFn.REQUIRED,
                msg: 'Phone Number is required'
            },
            {
                fn: validateFn.SIZE(10),
                msg: 'Please enter a valid 10-digit phone number.'
            }
        ],
        allowOnly: /[^0-9]/g,
        formatFn: formatFn.PHONE
    }, {
        inputName: 'vehicle-year',
        validator: [{
            fn: validateFn.REQUIRED,
            msg: 'Vehicle year is required'
        }]
    }, {
        inputName: 'vehicle-make',
        validator: [{
            fn: validateFn.REQUIRED,
            msg: 'Vehicle make is required'
        }]
    }, {
        inputName: 'shopName',
        validator: [{
                fn: validateFn.REQUIRED,
                msg: 'Shop Name is required'
            },
            {
                fn: validateFn.MIN(4),
                msg: 'Shop Name is required'
            },
            {
                fn: validateFn.MAX(100),
                msg: 'Shop Name is required'
            }
        ],
    }, {
        inputName: 'shopPhone',
        maxLength: 10,
        validator: [{
                fn: validateFn.REQUIRED,
                msg: 'Shop Phone Number is required'
            },
            {
                fn: validateFn.MIN(7),
                msg: 'Shop Phone Number is required'
            },
            {
                fn: validateFn.MAX(10),
                msg: 'Shop Phone Number is required'
            }
        ],
        allowOnly: /[^0-9]/g,
        formatFn: formatFn.PHONE
    }, {
        inputName: 'shopCity',
        validator: [{
                fn: validateFn.REQUIRED,
                msg: 'Shop City is required'
            },
            {
                fn: validateFn.MIN(2),
                msg: 'Shop City is required'
            },
            {
                fn: validateFn.MAX(30),
                msg: 'Shop City is required'
            }
        ],
        allowOnly: /[^a-zA-Z]/g
    }, {
        inputName: 'stateCode',
        validator: [{
            fn: validateFn.REQUIRED,
            msg: 'Shop State is required'
        }]
    }, {
        inputName: 'zipCode',
        validator: [{
                fn: validateFn.REQUIRED,
                msg: 'Shop Zip code is required'
            },
            {
                fn: validateFn.MIN(5),
                msg: 'Shop Zip code is required'
            },
            {
                fn: validateFn.MAX(9),
                msg: 'Shop Zip code is required'
            }
        ],
        allowOnly: /[^0-9]/g
    }]
}

const claimFormCtl = new FormControl(claimForm);
