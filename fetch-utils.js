const SUPABASE_URL = 'https://gxwgjhfyrlwiqakdeamc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjQxMTMxMiwiZXhwIjoxOTUxOTg3MzEyfQ.PHekiwfLxT73qQsLklp0QFEfNx9NlmkssJFDnlvNIcA';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

export async function createCharacter(character){
    const newCharacter = {
        ...character, 
        user_id: client.auth.user().id, 
    };

    // use the newCharacter to create a single new character for this user in supabase
    const response = await client
        .from('characters')
        .insert([newCharacter])
        .single();
    return checkError(response);
}

export async function updateCharacter(part, value, id){

    const response = await client
        .from('characters')
        .update({ [part]: value })
        .match({ id: id });

    return checkError(response);    
}

export async function getCharacter() {
    const response = await client
        .from('characters')
        .select()
        .match({ user_id: client.auth.user().id })
        .single();

    return checkError(response);    
}

export async function getUser() {
    return client.auth.session();
}


export async function checkAuth() {
    const user = await getUser();

    if (!user) location.replace('../'); 
}

export async function redirectToBuild() {
    if (await getUser()) {
        location.replace('./build');
    }
}

export async function signupUser(email, password){
    const response = await client.auth.signUp({ email, password });
    
    return response.user;
}

export async function signInUser(email, password){
    const response = await client.auth.signIn({ email, password });

    return response.user;
}

export async function logout() {
    await client.auth.signOut();

    return window.location.href = '../';
}

function checkError({ data, error }) {
    return error ? console.error(error) : data;
}
