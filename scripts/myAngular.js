(function () {
    var gitaApp = angular.module("gitaApp", ["ngResource"])

    gitaApp.filter("sanitize", ['$sce', function ($sce) {
        return function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        }
    }]);

    gitaApp.service('chapterService', function () {
        var self = this;

        self.chapter = 0;

        self.sloka = 1;

        self.slokasArray = [9, 47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78, 22];

        self.active = true;

        self.getFormattedNumber = function (num) {
            if (num < 10) {
                return "0" + num;
            }
            return num;
        };

        self.resetSloka = function () {
            self.sloka = 1;
        };

        return {
            setChapter: function (chap) {
                self.resetSloka();
                self.chapter = chap;

            },
            getChapter: function () {
                return self.chapter;
            },
            getSloka: function () {
                return self.sloka;
            },

            setSloka: function (slokaNum) {
                self.sloka = slokaNum;
            },

            getNumberOfSlokas: function () {
                return self.slokasArray[self.chapter];
            },

            getURL: function (type) {
                var chapName = "chap" + self.getFormattedNumber(self.chapter);
                return chapName + "/" + type + "_" + self.getFormattedNumber(self.chapter) +
                    "_" + self.getFormattedNumber(self.sloka) + ".txt";
            },

            isActive: function () {
                return self.active;
            },

            setActive: function (activeState) {
                self.active = activeState;
            }
        }
    });


    gitaApp.service('toggleService', function () {

        var self = this;

        self.active = true;

        return {
            set: function (activeState) {
                self.active = activeState;
            },
            get: function () {
                return self.active;
            }
        }
    });

    gitaApp.controller("toggleController", ['$scope', 'chapterService', function ($scope, chapterService) {

        var self = this;
        self.isActive = function () {
            return chapterService.isActive();
        };

        self.toggleActive = function () {
            var active = chapterService.isActive() ? false : true;
            chapterService.setActive(active);
        };
    }]);


    gitaApp.controller('chapterController', ['$scope', 'chapterService', function ($scope, chapterService) {
        var self = this;
        self.chapters = ['Dhyanam', 'Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5', 'Chapter 6', 'Chapter 7',
            'Chapter 8', 'Chapter 9', 'Chapter 10', 'Chapter 11', 'Chapter 12', 'Chapter 13', 'Chapter 14', 'Chapter 15',
            'Chapter 16', 'Chapter 17', 'Chapter 18', 'Mahaatmym'];

        self.chapterChanged = function (chapter) {
            chapterService.setChapter(chapter);
            $scope.$broadcast('chapterChanged', chapter);
        };

        self.getChapter = function () {
            return chapterService.getChapter();
        }

        self.activeLink = function (index) {
            return chapterService.getChapter() === index;
        };

        self.init = function () {
            self.chapterChanged(0);
        };

        self.isActive = function () {
            return chapterService.isActive();
        };

        self.init();

    }]);

    gitaApp.controller('slokaController', ['$scope', '$http', 'chapterService', function ($scope, $http, chapterService) {
        var self = this;
        self.requestTypes = ['sanskrit', 'english', 'meaning'];
        self.sanskrit = "";
        self.english = "";
        self.meaning = "";
        $scope.navbarCollapsed = true;


        $scope.$on('chapterChanged', function (event, value) {
            chapterService.setChapter(value);
            chapterService.setSloka(1);
            self.fetchData();
        });


        self.getSloka = function () {
            return chapterService.getSloka();
        };

        self.fetchData = function () {
            for (index in self.requestTypes) {
                var type = self.requestTypes[index];
                setTimeout((function (currentType) {
                    return function () {
                        $http.get(chapterService.getURL(currentType))
                        .success(function (data) {
                            if (currentType === 'sanskrit') {
                                self.sanskrit = data;
                            }
                            else if (currentType === 'english') {
                                self.english = data;
                            }
                            else if (currentType === 'meaning') {
                                self.meaning = data;
                            }
                        });
                    };
                })(type), 500);
            }
        };

        self.setSloka = function () {
            if (chapterService.getSloka() <= self.numSlokas) {
                self.fetchData('sanskrit');
            }
        };

        self.incrementSloka = function () {
            var currentSloka = chapterService.getSloka();
            var chapter = chapterService.getChapter();
            if (++currentSloka <= chapterService.getNumberOfSlokas()) {
                chapterService.setSloka(currentSloka);
            }
            else {
                chapterService.setSloka(1);
                var currentChapter = ++chapter;
                if (currentChapter > 19) {
                    currentChapter = 0;
                }
                chapterService.setChapter(currentChapter);
            }
            self.fetchData();
        };

        self.decrementSloka = function () {
            var currentSloka = chapterService.getSloka();
            var chapter = chapterService.getChapter();
            if (--currentSloka > 0) {
                chapterService.setSloka(currentSloka);
            }
            else {
                var currentChapter = --chapter;
                if (currentChapter < 0) {
                    currentChapter = 19;
                }

                chapterService.setChapter(currentChapter);
                chapterService.setSloka(chapterService.getNumberOfSlokas());
            }
            self.fetchData();
        };

        self.getChapter = function () {
            return chapterService.getChapter();
        };

        self.init = function () {
            chapterService.setSloka(1);
            self.fetchData();
        };

        self.isActive = function () {
            return chapterService.isActive();
        };

        self.init();
    }]);

})();

