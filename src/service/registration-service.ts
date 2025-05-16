const registrationService = () => {
  let _phone = '';
  let _iin = '';
  let _firstName = '';
  let _surname = '';
  let _middleName = '';
  let _pasportIssuedBy = '';
  let _citizenship = '';
  let _isRezident = true;
  let _personalIdentifierPhotoBase64 = '';
  let _personalIdentifierPhotoUri = '';
  let _driversLicencePhotoBase64 = '';
  let _driversLicencePhotoUri = '';
  let _isDriverLicenceSended = false;

  const setPhone = (phone: string) => {
    _phone = phone;
  };
  const setIin = (iin: string) => {
    _iin = iin;
  };
  const setFirstName = (firstName: string) => {
    _firstName = firstName;
  };
  const setSurname = (surname: string) => {
    _surname = surname;
  };
  const setMiddleName = (middleName: string) => {
    _middleName = middleName;
  };

  const setPasportIssuedBy = (pasportIssuedBy: string) => {
    _pasportIssuedBy = pasportIssuedBy;
  };

  const setIsRezident = (isRezident: boolean) => {
    _isRezident = isRezident;
  };
  const getIsRezident = () => _isRezident;

  const setPersonalIdentifierPhotoBase64 = (photo: string) => {
    _personalIdentifierPhotoBase64 = photo;
  };
  const getPersonalIdentifierPhotoBase64 = () => _personalIdentifierPhotoBase64;

  const setPersonalIdentifierPhotoUri = (uri: string) => {
    _personalIdentifierPhotoUri = uri;
  };
  const getPersonalIdentifierPhotoUri = () => _personalIdentifierPhotoUri;

  const setDriversLicencePhotoBase64 = (photo: string) => {
    _driversLicencePhotoBase64 = photo;
  };
  const getDriversLicencePhotoBase64 = () => _driversLicencePhotoBase64;

  const setDriversLicencePhotoUri = (uri: string) => {
    _driversLicencePhotoUri = uri;
  };
  const getDriversLicencePhotoUri = () => _driversLicencePhotoUri;
  
  const setIsDriverLicenceSended = (val: boolean) => {
    _isDriverLicenceSended = val;
  };
  const getIsDriverLicenceSended = () => _isDriverLicenceSended;

  const getUserData = () => ({
    citizenship: _citizenship,
    firstName: _firstName,
    iin: _iin,
    isRezident: _isRezident,
    middleName: _middleName,
    pasportIssuedBy: _pasportIssuedBy,
    personalIdentifierPhotoBase64: _personalIdentifierPhotoBase64,
    phone: _phone,
    surname: _surname,
  });

  const wipeData = () => {
    _phone = '';
    _iin = '';
    _firstName = '';
    _surname = '';
    _middleName = '';
    _pasportIssuedBy = '';
    _citizenship = '';
    _isRezident = false;
    _personalIdentifierPhotoBase64 = '';
  };

  return {
    getDriversLicencePhotoBase64,
    getDriversLicencePhotoUri,
    getIsDriverLicenceSended,
    getIsRezident,
    getPersonalIdentifierPhotoBase64,
    getPersonalIdentifierPhotoUri,
    getUserData,
    setDriversLicencePhotoBase64,
    setDriversLicencePhotoUri,
    setFirstName,
    setIin,
    setIsDriverLicenceSended,
    setIsRezident,
    setMiddleName,
    setPasportIssuedBy,
    setPersonalIdentifierPhotoBase64,
    setPersonalIdentifierPhotoUri,
    setPhone,
    setSurname,
    wipeData,
  };
};

export default registrationService();
