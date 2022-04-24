# DevTools

This Component decides which format need to show to the user based on the Tab Value.

## Props

DevTools needs the following props -

1. tabValue:

- This contains the index value of the tabs by which it decide to show the following section.

2. initialEntityFormData :

- This contains an Json Object which need to get converted in the JsonToXml Component.
- It is an Json type field

3. identValue :

- This is used as third argument in Json.Stringify.

4. onHandleTabChange :

- This is the callback function which will handles which tab need to be shown
