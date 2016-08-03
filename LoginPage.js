var LoginPage = function(casper) {
    this.casper = casper;
};

LoginPage.prototype.typeUsername = function(username) {

    this.evaluate(function() {
        __utils__.findOne('input.username').value = username;
    });
};

exports = LoginPage;
