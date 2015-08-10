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

        return {
            set: function (chap) {
                self.chapter = chap;
            },
            get: function () {
                return self.chapter;
            }
        }
    });

    gitaApp.controller('chapterController', ['$scope', "chapterService", function ($scope, chapterService) {
        var self = this;
        self.chapters = ['Dhyanam', 'Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5', 'Chapter 6', 'Chapter 7',
            'Chapter 8', 'Chapter 9', 'Chapter 10', 'Chapter 11', 'Chapter 12', 'Chapter 13', 'Chapter 14', 'Chapter 15',
            'Chapter 16', 'Chapter 17', 'Chapter 18', 'Mahaatmym'];

        self.chapterChanged = function (chapter) {
            chapterService.set(chapter);
            $scope.$broadcast('chapterChanged', chapter);
        };

        self.getChapter = function () {
            return chapterService.get();
        }

        this.active = function (index) {
            return chapterService.get() === index;
        };

        self.init = function () {
            self.chapterChanged(0);
        };

        self.init();

    }]);

    gitaApp.controller('slokaController', ['$scope', '$http', "chapterService", function ($scope, $http, chapterService) {
        var self = this;
        self.slokasArray = [9, 47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78, 22];
        self.sloka = 1;
        self.requestTypes = ['sanskrit', 'english', 'meaning'];
        self.numSlokas = self.slokasArray[chapterService.get()];
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

        self.getURL = function (type) {
            var chapName = "chap" + self.getFormattedNumber(chapterService.get());
            return chapName + "/" + type + "_" + self.getFormattedNumber(chapterService.get()) + "_" + self.getFormattedNumber(self.sloka) + ".txt";
        };

        $scope.$on('chapterChanged', function (event, value) {
            chapterService.set(value);
            self.sloka = 1;
            self.numSlokas = self.slokasArray[value];
            self.fetchData();
        });

        self.fetchData = function () {
            for (index in self.requestTypes) {
                var type = self.requestTypes[index];
                setTimeout((function (currentType) {
                    return function () {
                        $http.get(self.getURL(currentType))
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
            if (self.sloka <= self.numSlokas) {
                self.fetchData('sanskrit');
            }
        };

        self.incrementSloka = function () {
            var currentSloka = self.sloka;
            var chapter = chapterService.get();
            if (++currentSloka <= self.numSlokas) {
                self.sloka = currentSloka;
            }
            else {
                self.sloka = 1;
                var currentChapter = ++chapter;
                if (currentChapter > 19) {
                    currentChapter = 0;
                }
                chapterService.set(currentChapter);
                self.numSlokas = self.slokasArray[currentChapter];
            }
            self.fetchData();
        };

        self.decrementSloka = function () {
            var currentSloka = self.sloka;
            var chapter = chapterService.get();
            if (--currentSloka > 0) {
                self.sloka = currentSloka;
            }
            else {
                var currentChapter = --chapter;
                if (currentChapter < 0) {
                    currentChapter = 19;
                }

                chapterService.set(currentChapter);
                self.sloka = self.slokasArray[currentChapter];
                self.numSlokas = self.slokasArray[currentChapter];
            }
            self.fetchData();
        };

        self.getChapter = function () {
            return chapterService.get();
        }

        self.init = function () {
            self.sloka = 1;
            self.numSlokas = self.slokasArray[self.chapter];
            self.fetchData();
        };

        self.init();
    }]);

})();

