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

        self.getFormattedNumber = function (num) {
            if (num < 10) {
                return "0" + num;
            }
            return num;
        };

        return {
            setChapter: function (chap) {
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

            getURL: function (type) {
                var chapName = "chap" + self.getFormattedNumber(self.chapter);
                return chapName + "/" + type + "_" + self.getFormattedNumber(self.chapter) +
                    "_" + self.getFormattedNumber(self.sloka) + ".txt";
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

    gitaApp.controller("toggleController", ['$scope', 'toggleService', function ($scope, toggleService) {

        var self = this;
        self.isActive = function () {
            return toggleService.get();
        };

        self.toggleActive = function () {
            var active = toggleService.get() ? false : true;
            toggleService.set(active);
        };
    }]);


    gitaApp.controller('chapterController', ['$scope', 'chapterService', 'toggleService', function ($scope, chapterService, toggleService) {
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
            return toggleService.get();
        };

        self.init();

    }]);

    gitaApp.controller('slokaController', ['$scope', '$http', "chapterService", 'toggleService', function ($scope, $http, chapterService, toggleService) {
        var self = this;
        self.slokasArray = [9, 47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78, 22];
        self.sloka = 1;
        self.requestTypes = ['sanskrit', 'english', 'meaning'];
        self.numSlokas = self.slokasArray[chapterService.getChapter()];
        self.sanskrit = "";
        self.english = "";
        self.meaning = "";
        $scope.navbarCollapsed = true;
        self.getFormattedNumber = function (num) {
            if (num < 10) {
                return "0" + num;
            }
            return num;
        };

        //self.getURL = function (type) {
        //    var chapName = "chap" + self.getFormattedNumber(chapterService.getChapter());
        //    return chapName + "/" + type + "_" + self.getFormattedNumber(chapterService.getChapter()) + "_" + self.getFormattedNumber(self.sloka) + ".txt";
        //};

        $scope.$on('chapterChanged', function (event, value) {
            chapterService.setChapter(value);
            chapterService.setSloka (1);
            self.numSlokas = self.slokasArray[value];
            self.fetchData();
        });

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
            if (++currentSloka <= self.numSlokas) {
                chapterService.setSloka(currentSloka);
            }
            else {
                chapterService.setSloka(1);
                var currentChapter = ++chapter;
                if (currentChapter > 19) {
                    currentChapter = 0;
                }
                chapterService.setChapter(currentChapter);
                self.numSlokas = self.slokasArray[currentChapter];
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
                chapterService.setSloka(self.slokasArray[currentChapter]);
                self.numSlokas = self.slokasArray[currentChapter];
            }
            self.fetchData();
        };

        self.getChapter = function () {
            return chapterService.getChapter();
        };

        self.init = function () {
            chapterService.setSloka(1);
            self.numSlokas = self.slokasArray[self.chapter];
            self.fetchData();
        };

        self.isActive = function () {
            return toggleService.get();
        };

        self.init();
    }]);

})();

