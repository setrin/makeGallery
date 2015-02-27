/*jshint latedef: true */
/*global console */
/*global jQuery */
/*global $ */

(function ($) {
    "use strict";
    $.fn.makeGallery = function (options) {
        var parentElement = this,
            defaultImages = parentElement.children(),
            newGallery = null,
            numberOfChlids = defaultImages.length - 1,
            settings = $.extend({
                position: 0
            }, options),
            
            /**
             * Convert data to object
             * @param int defaultImagesIndex
             * @return object
             */
            convertData = function (defaultImagesIndex) {
                var holder = defaultImages[defaultImagesIndex],
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
                var i,
                    defaultImagesLength = defaultImages.length,
                    imageDataHolder = null,
                    pageing = "",
                    newGalleryString = "<div class='gallery'><div class='navigationHolder' data-position='prev'><a href='#' class='navigation' data-position='prev'><</a></div>";
                for (i = 0; i < defaultImagesLength; i++) {
                    imageDataHolder = convertData(i);
                    newGalleryString += "<a href='" + imageDataHolder.dataHref + "' class='picture hidden' data-order='" + i + "'><img src='" + imageDataHolder.dataImage + "' /><ul><li>" + imageDataHolder.dataTitle + "</li><li>@" + imageDataHolder.dataAuthor + "</li></ul></a>";
                    pageing += "<a href='#' class='pageing' data-position=" + i + ">" + (i + 1) + "</a>";
                }
                
                $(parentElement).children().addClass("hidden");
                newGalleryString += "<div class='navigationHolder' data-position='next'><a href='#' class='navigation' data-position='next'>></a></div><ul class='pageingUl'>" + pageing + "</ul></div>";
                newGallery = $(newGalleryString);
                $(parentElement).append(newGallery);
            },
            
            /**
             * Highlight currently selected page
             * @param int pastPage
             * @return void
             */
            highlitePage = function (pastPosition) {
                $(newGallery).children(".pageingUl").children(".pageing[data-position*=" + pastPosition + "]").removeClass('highlight');
                $(newGallery).children(".pageingUl").children(".pageing[data-position*=" + settings.position + "]").addClass('highlight');
            },
            
            /**
             * Show/Hide navigation arrows
             * @return void
             */
            manageNavigation = function () {
                if (settings.position === 0) {
                    $(newGallery).children(".navigationHolder[data-position=prev]").children(".navigation").addClass("hidden");
                    $(newGallery).children(".navigationHolder[data-position=next]").children(".navigation").removeClass("hidden");
                } else if (settings.position === numberOfChlids) {
                    $(newGallery).children(".navigationHolder[data-position=next]").children(".navigation").addClass("hidden");
                    $(newGallery).children(".navigationHolder[data-position=prev]").children(".navigation").removeClass("hidden");
                } else {
                    $(newGallery).children(".navigationHolder[data-position=prev]").children(".navigation").removeClass("hidden");
                    $(newGallery).children(".navigationHolder[data-position=next]").children(".navigation").removeClass("hidden");
                }
            },
            
            /**
             * Go to specific page
             * @param int dataPosition
             * @return void
             */
            goToPage = function (dataPosition) {
                var children = null,
                    i,
                    pastPosition = settings.position;
                
                $(newGallery).children(".picture[data-order*=" + pastPosition + "]").addClass('hidden');
                if (dataPosition === "next") {
                    settings.position++;
                    if (settings.position > numberOfChlids) {settings.position = numberOfChlids; }
                } else if (dataPosition === "prev") {
                    settings.position--;
                    if (settings.position < 0) {settings.position = 0; }
                } else {
                    settings.position = parseInt(dataPosition);
                }
                
                highlitePage(pastPosition);
                manageNavigation();
                $(newGallery).children(".picture[data-order*=" + settings.position + "]").removeClass('hidden');
            };
        
        if (settings.position > 0) {settings.position -= 1; }
        appendNewGallery();
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