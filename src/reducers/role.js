const role = (state = -1, action) => {
    switch (action.type) {
        case 'SET_ROLE': state = action.id; break;
        default: state = -1; break;
    }
    return state;
}

export default role;