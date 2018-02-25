# ArcGIS Online JSON Field Editor

Edited your JSON field configurations quickly.

## Getting Started

Load your own ArcGIS online field data JSON file, make changes, save the file and upload back into ArcGIS Online using the [ArcGIS Online Assistant](https://ago-assistant.esri.com/)

### Key Features

Quickly edit your field configurations for:
* Labels
* Visibility
* Digital Separators
* Dates
* Decimal Places
* Save/Load you field configurations settings.
* Load and apply a JSON configuration file to apply to all fields where match.
* Filters for fields settings.

### How to use
* Save a copy of your ArcGIS Online Assistant JSON file to disk, also serves as back-up.
* Load the file into the ArcGIS Online JSON Field Editor.
* Configure how you want to fields to be used.
* Save the JSON file.
* Re-upload back into ArcGIS Online Assistant and save your edits. 

### Prerequisites

Use of the ArcGIS online Assistant and how to get to view your JSON data there.

## FAQ

Q: When I view the raw JSON it’s all compacted, aka Minified.
A: Use an online JSON Beautifier to change this, like this one [JSONFormatter](https://jsonformatter.org/)

## Notes
* This tool has no affiliation with ESRI
* This tool applies rules to all fields with the same fieldname. For example if you have three layers with the fieldname “TYPE” it will apply the rules across all of them. For editing this detailed level of manually edit the JSON file after you’ve made the changes with this tool first.

## Questions? Need Help? Found a bug, or want to request a new feature?

Please submit a ticket on this GitHub. And, of course, feel free to submit pull requests with bug fixes or changes to the dev branch.

## Authors

* **Tristan Forward** - *Initial work* - [tforward](https://github.com/tforward)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* StackExchange for helping me anytime was in a bind
