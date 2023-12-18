function random_move(character, heightlimit) {
    if (character.position.x >= width - character.width / 2) {
        character.velocity.x = -random(12);
    } else if (character.position.x <= 0 + character.width / 2) {
        character.velocity.x = random(12);
    } else if (character.position.y >= height - (character.height/2) ) {
        character.velocity.y = -random(7);
    } else if (character.position.y <= heightlimit + character.height / 2) {
        character.velocity.y = random(7);
    } 
}

function touch_detection(i) {
    x_dif = Math.abs(mouseX - i.position.x);
    y_dif = Math.abs(mouseY - i.position.y);
    if (x_dif < 30 && y_dif < 30) {
        i.position.x = mouseX;
        i.position.y = mouseY;
    } else {
        random_move(i, 300)
    }
}