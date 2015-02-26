/*jshint latedef: true */
/*global console */
/*global jQuery */
/*global $ */

(function ($) {
    "use strict";
    $.fn.makeGallery = function (options) {
        var parentElement = this,
            data = parentElement.children(),
            newGallery = null,
            numberOfChlids = data.length - 1,
            settings = $.extend({
                position: 0
            }, options),
            
            /**
             * Convert data to object
             * @param int dataIndex
             * @return object
             */
            convertData = function (dataIndex) {
                var holder = data[dataIndex],
                    dataAttrs = {
                        dataTitle: $(holder).attr("data-title"),
                        dataAuthor: $(holder).attr("data-author"),
                        dataClass: $(holder).attr("class"),
                        dataHref: $(holder).attr("href"),
                        dataImage: $(holder).attr("data-img")
                    };
                return dataAttrs;
            },
            
            /**
             * Append new gallery to parentElement
             * @return void
             */
            appendNewGallery = function () {
                var i = 0,
                    imageDataHolder = null,
                    pageing = null;
                newGallery = $("<div class='gallery'><div class='navigationHolder'><a href='#' class='navigation' data-position='prev'><</a></div</div>");
                $(parentElement).append(newGallery);
                for (i = 0; i < data.length; i += 1) {
                    imageDataHolder = convertData(i);
                    $(newGallery).append("<a href='" + imageDataHolder.dataHref + "' class='picture' data-order='" + i + "'><img src='" + imageDataHolder.dataImage + "' /><ul><li>" + imageDataHolder.dataTitle + "</li><li>@" + imageDataHolder.dataAuthor + "</li></ul></a>");
                }
                $(newGallery).append("<div class='navigationHolder'><a href='#' class='navigation' data-position='next'>></a></div>");
                pageing = $("<ul class='pageingUl'></ul>");
                $(newGallery).append(pageing);
                for (i = 0; i < data.length; i += 1) {
                    $(pageing).append("<li><a href='#' class='pageing' data-position=" + i + ">" + (i + 1) + "</a></li>");
                }
            },
            
            /**
             * Destroy old gallery data from parentElemen
             * @return void
             */
            destroyOldData = function () {
                var i = 0;
                for (i = 0; i < data.length; i += 1) {
                    if ($(data[i]).attr("class") === "gallery") {
                        $(data[i]).remove();
                    }
                }
            },
            
            /**
             * Highlight currently selected page
             * @param int futurePage
             * @return void
             */
            highlitePage = function (futurePage) {
                var i = 0,
                    pages = $(newGallery).children(".pageingUl").children();
                for (i = 0; i <= numberOfChlids; i += 1) {
                    if (parseInt($(pages[i]).children('.pageing').attr("data-position"), 10) === futurePage) {
                        $(pages[i]).children('.pageing').addClass('highlight');
                    } else {
                        $(pages[i]).children('.pageing').removeClass('highlight');
                    }
                }
            },
            
            /**
             * Show/Hide navigation arrows
             * @param int futurePosition
             * @return void
             */
            manageNavigation = function (futurePosition) {
                var navHolder = $(newGallery).children('.navigationHolder');
                $(navHolder[0]).children(".navigation").removeClass('hidden');
                $(navHolder[1]).children(".navigation").removeClass('hidden');
                if (futurePosition <= 0) {
                    $(navHolder[0]).children(".navigation").addClass('hidden');
                } else if (futurePosition >= numberOfChlids) {
                    $(navHolder[1]).children(".navigation").addClass('hidden');
                }
            },
            
            /**
             * Get currently selected page
             * @return int currentPosition
             */
            getCurrentPosition = function () {
                var i = 0,
                    children = null,
                    currentPosition = 0;
                for (i = 0; i < newGallery.children().length; i += 1) {
                    children = newGallery.children()[i];
                    if ($(children).hasClass("picture") && $(children).is(":visible")) {
                        currentPosition = parseInt($(children).attr("data-order"), 10);
                    }
                }
                return currentPosition;
            },
            
            /**
             * Go to specific page
             * @param int dataPosition
             * @return void
             */
            goToPage = function (dataPosition) {
                var currentPosition = getCurrentPosition(),
                    children = null,
                    i = 0;
                
                if (dataPosition === "next") {
                    settings.position = currentPosition + 1;
                    if (settings.position > numberOfChlids) {settings.position = numberOfChlids; }
                } else if (dataPosition === "prev") {
                    settings.position = currentPosition - 1;
                    if (settings.position < 0) {settings.position = 0; }
                } else {
                    settings.position = parseInt(dataPosition, 10);
                }
                
                highlitePage(settings.position);
                manageNavigation(settings.position);
                for (i = 0; i < newGallery.children().length; i += 1) {
                    children = newGallery.children()[i];
                    if ($(children).hasClass('picture')) {
                        if (parseInt($(children).attr("data-order"), 10) === settings.position) {
                            $(children).removeClass("hidden");
                        } else {
                            $(children).addClass("hidden");
                        }
                    }
                }
            };
        
        if (settings.position > 0) {settings.position -= 1; }
        appendNewGallery();
        destroyOldData();
        goToPage(settings.position);
        $(parentElement).on("click", '.navigation', function () {
            goToPage($(this).attr("data-position"));
        });
        
        $(parentElement).on("click", '.pageing', function () {
            goToPage($(this).attr("data-position"));
        });
    };
}(jQuery));

window.onload = function () {
    "use strict";
    $("#myGallery").makeGallery({position: 5});
};