# TagDropdown

## Props

1. tagType : Tag Type for which have to display in the dropdown

This component renders dropdown which has list of tags with its type

Tag list will be provided by category service API "galleria/v1/categories/tags?groupByTagType=true"

This component is managing its own state in the redux(Key: TagDropdownData).
to retrieve the state you can use useSelector from react-redux Package.
e.g const { domain } = useSelector((state) => state.TagDropdownData.domainData);
e.g const { geo } = useSelector((state) => state.TagDropdownData.geoData);

Examples of tag types- domainData: Domain, geoData: Geo

<TagDropdown tagType="domainData" />
<TagDropdown tagType="geoData" />
