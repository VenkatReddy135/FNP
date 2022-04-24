# Custom Hooks

useCustomQuery and useCustomQueryWithStore return the object from useQuery and useQueryWithStore respectively.

## Parameters

useCustomQuery and useCustomQueryWithStore take the following parameters -

1. type :

- This is of string type and is a mandatory parameter. This is basically the method to call on the Data Provider.
  For Example:
  const type = "getList"

2. resource :

- This is of string type and is a mandatory parameter. This is basically the request URL for the API call.

  For Example:
  const resource = `${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/admin/${domain.toLowerCase()}/`

3. handleSuccess :

- This is the function which contains the statements to be executed when the user gets a successful response. This is also a mandatory parameter.

- For Example:
  const handleUpdateSuccess = (res) => {
  if (res.data?.params) setData(res.data);
  };

4. The 4th parameter is an object with 4 properties. This is completely optional, but if you want to pass a bad request handler, custom failure or payload, then you need to use this. The properties are described below.

   1. handleBadRequest : This is a function which contains the statements to be executed if the response has an error and we want to do some action on that.

      For Example:
      const handleBadRequest = (res) => {
      setPartyCreated(false);
      notify(res.data?.errors[0]?.message);
      }

   2. handleFailure : This is a function which contains the statements to be executed on Failure. By default we are handling the failure by creating a dictionary which contains all the necessary error handling, but if somebody passes the customized failure, then the customized error message will be seen on the UI.
      I will recommend not to initialize this, but if your use-case requires, feel free to use it.

      For Example:
      const handleFailure = () => {
      notify(translate("adminEmailUpdateFailed"), "error", TIMEOUT);
      };

   3. enabled : This is a boolean value, which is by default set to true. If this is set to true, the call to useQuery/useQueryWithStore will me made else the call won't be made. We can also have a custom value for this.

      For Example:
      const enabled = domain.toLowerCase() !== "";

   4. payload : This is an object, whose default value is an empty object({}). But the user can pass in there own customized payload as well.

      For Example:
      const payload = { id: domain.toLowerCase() }

# useBoolean Hooks

useBoolean return the object containing functionalities to toggle between boolean value.

## Parameters

useBoolean take the following parameter -

1. initialBooleanValue :

- This is of boolean type and is a mandatory parameter. This is basically used to set
  the initial value.
  For Example:
  const [flag,setFlag]=useBoolean(false)

### Few Examples

1. useCustomQuery(type, resource, handleUpdateSuccess, {handleFailure:handleUpdateFailure});

2. useCustomQuery(type, resource, handleUpdateSuccess, {handleFailure:handleUpdateFailure, enabled, payload});

3. const { loading } = useCustomQueryWithStore(type, resource, handleUpdateSuccess, { enabled, payload });

4. useCustomQueryWithStore(type, resource, handleUpdateSuccess);

5. useCustomQueryWithStore(type, resource, handleUpdateSuccess, {handleBadRequest});

NOTE : In case of useMutation, useCreate, mutate etc., no Custom hook has been created as it was creating rendering issues, but you can still use the onSuccess and onFailure functions in HelperFunctions.js file. The handleBadRequest parameter in onSuccess and handleFailure in onFailure are optional, whose descriptions are mentioned in 4.1 and 4.2 points above. See below examples for reference.

1. onSuccess : onSuccess basically takes an object which gets deserialized to response, notify, translate, handleSuccess, handleBadRequest.

2. onFailure : onFailure takes an object which gets deserialized to error, notify, translate, handleFailure.

For Example :
mutate(
{
type: "put",
resource,
payload: mutationPayload,
},
{
onSuccess: (response) => {
onSuccess({ response, notify, translate, handleSuccess: handleUpdateSuccess });
},
onFailure: (error) => {
onFailure({ error, notify, translate, handleFailure: handleUpdateFailure });
},
},
);

# useBoolean Hook

useBoolean return the object containing functionalities to toggle between boolean value.

## Parameters

useBoolean take the following parameter -

1. initialBooleanValue :

- This is of boolean type and is a mandatory parameter. This is basically used to set
  the initial value.

### Few Examples

const [flag,setFlag]=useBoolean(false)

- to set the flag value to true
  setFlag.on()

- to set the flag value to false
  setFlag.off()

- to toggle previous flag value
  setFlag.toggle()
