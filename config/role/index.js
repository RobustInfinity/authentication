module.exports = {
    simple:{
        'value':0,
        '/login/':["login"],
        '/register/':["register"],
        '/products/':["products",]
    },
    superAdmin:{
        'value':3,
        '/admin/': ['load-users' , 'set-new-password', 'update-userinfo', 'update-user-mobile', 'update-user-location', 'ban-user', 'load-user-by-id', 'register-existing', 'delete-user'],
        '/teacher/':["add","delete","edit"],
        '/student/':["add","delete","edit","test-result"],
    },
    admin:{
        'value':2
    },
    user:{
        'value':1,
        '/test/':["view","submit"],
        '/profile/': ['change-username', 'update-profile-data', 'update-mobile', 'resend-code', 'verify-code', 'set-new-password', 'upload-pic', 'update-location', 'update-social-links', 'verify-password', 'change-email'],

    }
}