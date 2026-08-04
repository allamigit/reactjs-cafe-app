
import MenuItem from '../model/MenuItem'

export const pastries = [
        new MenuItem('P-1','Butter Croissant', 230, 2.50, false, false, false),
        new MenuItem('P-2','Walnut Muffin', 420, 3.99, false, false, false),
        new MenuItem('P-3','Banana Muffin', 380, 3.99, false, false, false),
        new MenuItem('P-4','Cheese Danish', 240, 3.99, false, false, false),
        new MenuItem('P-5','Fruit Danish', 260, 4.99, false, false, false),
        new MenuItem('P-6','Cinnamon Roll', 280, 2.99, false, false, false),
        new MenuItem('P-7','Chocolate Chip Cookie', 80, 2.50, false, false, false),
        new MenuItem('P-8','Peanut Butter Cookie', 130, 2.50, false, false, false),
        new MenuItem('P-9','Sugar Cookie', 110, 2.50, false, false, false),
        new MenuItem('P-10','Chocolate Brownie', 130, 2.99, false, false, false)
    ];

export const cakes = [
        new MenuItem('C-1','Vanilla Cake', 250, 2.99, false, false, false),
        new MenuItem('C-2','Carrot Cake', 300, 3.99, false, false, false),
        new MenuItem('C-3','Lemon Cake', 320, 3.99, false, false, false),
        new MenuItem('C-4','Chocolate Cake', 350, 4.99, false, false, false),
        new MenuItem('C-5','Cheesecake', 400, 5.99, false, false, false),
        new MenuItem('C-6','Tiramisu', 430, 5.99, false, false, false)
    ];

export const hotDrinks = [
        new MenuItem('HD-1','Black Coffee', 8, 2.99, false, true, false),
        new MenuItem('HD-2','Hot Tea', 100, 2.99, false, true, false),
        new MenuItem('HD-3','Macchiato', 120, 3.99, false, true, true),
        new MenuItem('HD-4','Cappuccino', 140, 3.99, false, true, true),
        new MenuItem('HD-5','Flat White', 130, 3.99, false, true, true),
        new MenuItem('HD-6','Vanilla Latte', 130, 3.99, false, true, true),
        new MenuItem('HD-7','Chai Latte', 120, 2.99, false, true, true),
        new MenuItem('HD-8','Matcha Latte', 140, 4.99, false, true, true)
    ];

export const coldDrinks = [
        new MenuItem('CD-1','Iced Coffee', 8, 2.99, true, true, false),
        new MenuItem('CD-2','Iced Macchiato', 120, 3.99, true, true, true),
        new MenuItem('CD-3','Iced Vanilla Latte', 130, 3.99, true, true, true),
        new MenuItem('CD-4','Iced Chai Latte', 120, 2.99, true, true, true),
        new MenuItem('CD-5','Iced Matcha Latte', 140, 3.99, true, true, true),
        new MenuItem('CD-6','Iced Unsweet Tea', 5, 2.99, true, false, false),
        new MenuItem('CD-7','Iced Sweet Tea', 100, 2.99, true, false, false),
        new MenuItem('CD-8','Arnold Palmer', 80, 4.99, true, false, false)
    ];
