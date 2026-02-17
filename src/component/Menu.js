
import '../App.css';
import imgPath from '../assets/check-mark.png';
import { useState } from 'react';

export default function Menu(props) {
    const [qty, setQty] = useState({});
    const [options, setOptions] = useState({});
    const [addedItem, setAddedItem] = useState({});
    const isOrder = props.action === 'order' ? true : false;

    const plusQty = (itemId) => {
        setQty(prev => {
            const current = prev[itemId] || 0;
            if (current >= 10) return prev;
            return {
                ...prev,
                [itemId]: current + 1
            };
        });
    };

    const minusQty = (itemId) => {
        setQty(prev => ({
                ...prev,
                [itemId]: Math.max((prev[itemId] || 0) - 1, 0)
        }));
    };

    const handleCheckboxChange = (itemId, optionName, defaultValues) => {
        setOptions(prev => {
            const current = prev[itemId] || defaultValues;
            return {
                ...prev,
                [itemId]: {
                    ...current,
                    [optionName]: !current[optionName]
                }
            };
        });
    };

    const handleMilkChange = (itemId, value) => {
        setOptions(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                milk: value
            }
        }));
    };

    const handleAddToOrder = (item) => {
        // Define default values for all options
        const defaultOpts  = {
            ice: item.addIn1 ? true : false,
            sugar: item.addIn2 ? true : false,
            milk: item.addIn3 ? 'Whole Milk' : null
        };

        // Merge defaults with user-changed options
        const opts = {
            ...defaultOpts,
            ...options[item.itemId]
        };

        const newItem = {
            id: item.itemId,
            name: item.itemName,
            price: item.itemPrice,
            qty: qty[item.itemId] || 0,
            total: (qty[item.itemId] || 0) * item.itemPrice,
            ice: opts.ice,
            sugar: opts.sugar,
            milk: opts.milk,
            addIn2: item.addIn2
        };

        // Mark this item as added
        setAddedItem(prev => ({
            ...prev,
            [item.itemId]: newItem.qty > 0 ? true : false
        }));

        props.onAddToOrder(newItem);
    };

    window.scrollTo(0, 0)
    
    return (
        <div>
            <h4>{props.menu}</h4>
            <div className="Row">
                {props.data().map(item => {
                    const itemQty = qty[item.itemId] || 0;
                    const opts = options[item.itemId] || {
                        ice: item.addIn1 ? true : false,
                        sugar: item.addIn2 ? true : false,
                        milk: item.addIn3 ? 'Whole Milk' : null
                    };
                    const isAdded = addedItem[item.itemId];
                    const btn = isAdded ? 'Update' : 'Add';

                    return (
                        <div key={item.itemId} className="card">
                            <div className="card-inner">
                                <div className="card-content">
                                    <h5>
                                        {item.itemName}
                                        <span>{item.itemCalories} cal.</span>
                                    </h5>

                                    <div className="options">
                                        <h6>$ {item.itemPrice.toFixed(2)}</h6>
                                        <div className="quantity" hidden={!isOrder}>
                                            <p onClick={() => minusQty(item.itemId)}>–</p>
                                            <p>{itemQty}</p>
                                            <p onClick={() => plusQty(item.itemId)}>+</p>
                                        </div>
                                    </div>

                                    <div className="options" hidden={!isOrder}>
                                        <label className="form-check" hidden={!item.addIn1}>
                                            <input 
                                                type="checkbox" 
                                                checked={options[item.itemId]?.ice ?? (item.addIn1 ? true : false)}
                                                onChange={() => handleCheckboxChange(item.itemId, 'ice', {
                                                        ice: item.addIn1 ? true : false,
                                                        sugar: item.addIn2 ? true : false,
                                                        milk: item.addIn3 ? 'Whole Milk' : null
                                                    })
                                                }
                                            /> Ice
                                        </label>
                                        <label className="form-check" hidden={!item.addIn2}>
                                            <input 
                                                type="checkbox" 
                                                checked={options[item.itemId]?.sugar ?? (item.addIn2 ? true : false)}
                                                onChange={() => handleCheckboxChange(item.itemId, 'sugar', {
                                                        ice: item.addIn1 ? true : false,
                                                        sugar: item.addIn2 ? true : false,
                                                        milk: item.addIn3 ? 'Whole Milk' : null
                                                    })
                                                }
                                            /> Sugar
                                        </label>
                                    </div>

                                    <div className="options" hidden={!isOrder || !item.addIn3}>
                                        <label>Milk:</label>
                                        <select 
                                            className="form-select"
                                            value={opts.milk || 'Whole Milk'}
                                            onChange={(e) => handleMilkChange(item.itemId, e.target.value)}
                                        >
                                            <option value="Whole Milk">Whole Milk</option>
                                            <option value="2% Milk">2% Milk</option>
                                            <option value="Skim Milk">Skim Milk</option>
                                            <option value="Oat Milk">Oat Milk</option>
                                            <option value="Soy Milk">Soy Milk</option>
                                        </select>
                                        <button 
                                            className="btn btn-outline-primary" 
                                            disabled={itemQty === 0 && btn === "Add"}
                                            onClick={() => handleAddToOrder(item)}
                                        >
                                            {btn}
                                        </button>
                                    </div>
                                    <button 
                                        className="btn btn-outline-primary" 
                                        hidden={!isOrder || item.addIn3} 
                                        disabled={itemQty === 0 && btn === "Add"}
                                        onClick={() => handleAddToOrder(item)}
                                    >
                                        {btn}
                                    </button>
                                </div>
                                <img 
                                    className="menu-image"
                                    src={`https://reactjs-cafe-demo.s3.us-east-2.amazonaws.com/image/${item.itemId}.jpg`} 
                                    alt="menu-item" 
                                />
                                <img 
                                    className={`checkmark ${addedItem[item.itemId] ? 'visible' : ''}`} 
                                    src={imgPath} 
                                    alt="check-mark" 
                                    width="60" 
                                    height="60" 
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
