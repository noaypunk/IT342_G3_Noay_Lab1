import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, TextField, Selec, MenuItem, FormControl, InputLabel, Card, CardContent, Typography, Avatar } from "@nui/material";
import { WALLET_PROVIDERS, initiateDeposit } from "../services/digitalWalletService";

const DepositPage = () => {
    const { register, handleSubmit, formState:
        { errors } 
    } = useForm();
    const [selectedWallet, setSelectedWallet] = useState("");
    const [Loading, setLoading] = useState(false);
    const [depositResult, setDepositResult] = useState(null);
    //Handle form submission
    const onSubmit = async (data) => {
        setLoading(true);
        setDepositResult(null);
        try {
            const result = await initiateDeposit(parseFloat(data.amount), selectedWallet, user_id); //replace with userID
            setDepositResult({ type: "success", message: `Deposit initiated! Click here to pay:`, link: result.paymentUrl });
            //In production: redirect to payment url or display QR code
        } catch(err) {
            setDepositResult({ type: "error", message: err.message });
        }finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "0 1rem"}}>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBootom>
                        Digital Wallet Deposit
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* amount to input */}
                        <TextField
                        fullWidth
                        label="Deposit Amount (PHP)"
                        type="number"
                        step="0.01"
                        margin="normal"
                        {...register("amount", {
                            required: "Amount is required",
                            min: { value: 1, message: "Minimum deposit is PHP 1"}
                        })}
                        error={!!errors.amount}
                        helperText={errors.amount?.message}
                        />
                        {/* wallet selection */}
                        <FormControl fullWidth margin="normal"
                        required error={!selectedWallet && errors.wallet}>
                            <InputLabel>Select Digital Wallet</InputLabel>
                            <Select
                            value={selectedWallet}
                            label="Select Digital Wallet"
                            Onchange={(e) =>
                                setSelectedWallet(e.target.value)}>
                                    {WALLET_PROVIDERS.map((provider)=>(
                                        <MenuItem key={provider.id} value={provider.id}>
                                            <Avatar src={provider.logo} sx={{ mr: 2 }} />
                                            {provider.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                        </FormControl>
                        {/* sumbit button */}
                        <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ marginTop: "1rem" }}
                        disable={loading}>
                            {loading ? "Processing...": "Inititate Deposit"}
                        </Button>
                    </form>
                    {/* deposit result */}
                    {depositResult && (
                        <Typography
                        variant="body1"
                        style={{ marginTop: "1.5rem", color: depositResult.type === "success" ? "green" : "red" }}>
                            {depositResult.message}
                            {depositResult.link && (
                                <a href={depositResult.link} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "0.5rem"}}>
                                    Pay now
                                </a>
                            )}
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
export default DepositPage;