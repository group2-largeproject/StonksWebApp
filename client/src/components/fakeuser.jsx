export default function CreateFakeUser(){
    var fakeUser = "fakeuser123";
    var fakeEmail = "fake@email.com";
    var fakeFName = "Fake";
    var fakeLName = "Name";
    var fakeId = 123;

    var user = {username:fakeUser,email:fakeEmail,id:fakeId,fname:fakeFName,lname:fakeLName}
    localStorage.setItem('user_data', JSON.stringify(user));
}
