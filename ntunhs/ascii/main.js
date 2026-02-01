

function updateHash()
{
    // https://thevalleyofcode.com/how-to-get-fragment-part-url/
    character = window.location.hash;
    if (character.length != 0)
    {character = character.charAt(1);}
    else
    {character = "?";}

    const codepoint = character.codePointAt(0);
    
    result = `${character}`;
    result += ` / ${codepoint}`;
    result += ` / 0x${codepoint.toString(16)}`;

    q("#queryResult").textContent = result;
}

window.addEventListener("DOMContentLoaded", updateHash);
window.addEventListener("hashchange", updateHash);