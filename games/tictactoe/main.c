#include "logic.c"

#define NORMAL 1
#define INSANE 2

int prompt_move() {
    int input;
    printf("Enter your move (1 to 9): ");
    scanf("%d", &input);
    return input;
}

int choose_mode() {
    char mode = ' ';
    while (mode != 'N' && mode != 'I') {
        printf("Enter the mode ((N)ORMAL or (I)NSANE): ");
        scanf("%c", &mode);
    }
    if (mode == 'N') return NORMAL;
    else return INSANE;
}

int main() {
    int MODE = choose_mode();
    if (MODE == NORMAL) printf("\nMode: NORMAL\n");
    else printf("\nMode: INSANE\n");

    int board[9] = { EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY };

    printf("\nBoard:\n%s\n\n"
        , format_board(board)
    );

    for (int turn = 0; turn < 9 && !won(board); turn++) {
        int move = 10;
        while (move > 9 || move < 1 || board[move - 1] != EMPTY) move = prompt_move();
        board[move - 1] = X;

        if (++turn >= 9 || won(board)) {
            printf("Your move: %d\nBoard:\n%s\n\n"
                , move
                , format_board(board)
            );
            break;
        }

        int cmove = MODE == NORMAL ? basic_move(board, false) : best_move(board, false);
        board[cmove] = O;
        printf("Your move: %d\nComputer move: %d\nBoard:\n%s\n\n"
            , move
            , cmove + 1
            , format_board(board)
        );
    }

    printf("Final board:\n%s\n"
        , format_board(board)
    );

    if (!won(board)) printf("\nIt was a draw\n");
    else printf("\n%c won\n", format_cell(won(board)));

    printf("\nPress enter to exit: ");
    getchar();
    getchar();

    return 0;
}