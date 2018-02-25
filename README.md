[LOGO]
ArcGIS Online JSON Field Editor
Edited your field configurations quickly.
[Index]
Key Features
•	Quickly edit your field configurations for:
o	Labels
o	Visibility
o	Digital Separators
o	Dates
o	Decimal Places
•	Save/Load you field configurations settings.
•	Load and apply a JSON configuration file to apply to all fields where match.
•	Filters for fields settings.
Getting Started
Prerequisites
•	Use of the ArcGIS online Assistant and how to get to view your JSON data there.
How to use
•	Save a copy of your ArcGIS Online Assistant JSON file to disk, also serves as back-up.
•	Load the file into the ArcGIS Online JSON Field Editor.
•	Configure how you want to fields to be used.
•	Save the JSON file.
•	Re-upload back into ArcGIS Online Assistant and save your edits. 
Legend
[Show the different icons and what they mean]
First Use
Test out using the sample data to get a feel for how the tool works. Or load your own ArcGIS online field data JSON file, once changes have been made save the file and then upload back into ArcGIS Online using the ArcGIS Online Assistant.
Notes
•	This tool has no affiliation with ESRI it just processes ArcGIS Online formatted JSON field files
•	This tool applies rules to all fields with the same fieldname. For example if you have three layers with the fieldname “TYPE” it will apply the rules across all of them. For editing this detailed level of manually edit the JSON file after you’ve made the changes with this tool first.
Questions? Need Help? Found a bug, or want to request a new feature?
Please submit a ticket on this GitHub. And, of course, feel free to submit pull requests with bug fixes or changes to the dev branch.
Authors
•	Tristan Forward – Initial work
Acknowledgements
•	StackExchange for helping me when was in bind
FAQ
Q: When I view the raw JSON it’s all compacted, aka Minified.
A: Use an online JSON Beautifier to change this, like this one JSONFormatter
