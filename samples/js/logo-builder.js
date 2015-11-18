/// <reference path="../../src/raska.js" />

/// Configures raska to a given Canvas element
raska.installUsing({ targetCanvasId: "raskaContent" });

(function (w) {

    var $q = raska.$$.$q,
        _companyNameElement = $q("#companyName"),
        _iconElement = $q("#icon"),
        _companyNameSize = $q("#companyNameSize"),
        _companyNameFontFace = $q("#companyNameFontFace"),
        _fontColor = $q("#fontColor"),
        _decoration = $q("#decoration"),
        _labelPosition = { x: 159, y: 150 },
        _iconPosition = { x: 95, y: 150 },
        _size;

    w.UI = {
        update: function () {

            raska.clear();
            _size = parseInt(_companyNameSize.value);

            /// The company name
            var companyLabel = raska.newLabel(),
                companyLabelContent = raska.newSquare();
            companyLabel.text = _companyNameElement.value;
            companyLabel.y = _size;
            companyLabel.x = 0;
            companyLabel.color = _fontColor.value;
            companyLabel.font = { size: _size + "px", family: _companyNameFontFace.value, decoration: _decoration.value };
            companyLabelContent.dimensions.width = companyLabel.text.length * (_size / 2);
            companyLabelContent.dimensions.height = _size;
            companyLabelContent.border.color = "rgba(255, 255, 255, 0)";
            companyLabelContent.fillColor = "rgba(255, 255, 255, 0)";
            companyLabelContent.addChild(companyLabel);
            companyLabelContent.y = _labelPosition.y;
            companyLabelContent.x = _labelPosition.x;
            companyLabelContent.on.release(function (x, y) {
                _labelPosition.x = x;
                _labelPosition.y = y;
            });

            /// The company icon
            var companyIcon = raska.newLabel(),
                companyIconContent = raska.newSquare();
            companyIcon.text = String.fromCharCode("0x" + _iconElement.value);
            companyIcon.y = _size;
            companyIcon.x = 0;
            companyIcon.color = _fontColor.value;
            companyIcon.font = { size: _size + "px", family: "FontAwesome", decoration: _decoration.value }
            companyIconContent.dimensions.width = _size;
            companyIconContent.dimensions.height = _size;
            companyIconContent.border.color = "rgba(255, 255, 255, 0)";
            companyIconContent.fillColor = "rgba(255, 255, 255, 0)";
            companyIconContent.addChild(companyIcon);
            companyIconContent.y = _iconPosition.y;
            companyIconContent.x = _iconPosition.x;
            companyIconContent.on.release(function (x, y) {
                _iconPosition.x = x;
                _iconPosition.y = y;
            });

            raska.plot(companyLabelContent).plot(companyIconContent);

        },
        save: function () {
            raska.exportImage(true);
        }
    };

})(window);

UI.update();
