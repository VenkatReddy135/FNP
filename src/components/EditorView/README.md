# EditorView

EditorView component renders an editor component to display micro-data and json-ld data.

## Props

EditorView component needs the following props to render json-ld/micro-data -

1. title :

- This the title for the json-ld and micro-data grid layout

2. data :

- This is the data which is passed for micro-data and json-ld data to be displayed in the editor component.

3. selectedTab :

- This is the value of the tab which is selected. (Eg. json-ld or microdata)

4. onChangeTab :

- This is the function which is invoked on tab changed.

5. onValueChange :

- This is the function which is invoked if the value for json-ld or micro-data is updated.

6. disabled :

- If the page is opened in view mode then disabled flag is passed as true else false.
