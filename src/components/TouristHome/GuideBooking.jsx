import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useParams } from 'react-router-dom';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import { TextField, Button, FormControlLabel,
  Card,
  CardContent, Container } from '@mui/material';
import { useAuthContext } from "../../hooks/useAuthContext";
import Swal from 'sweetalert2';

const GuideBooking = () => {
  const guideId = useParams().id;
  const [guide, setGuide] = useState(null);
  const { user } = useAuthContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tourDate, setTourDate] = useState("");
  const [tourLocation, setTourLocation] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");
  const [expiryDateError, setExpiryDateError] = useState("");
  const [cvvError, setCvvError] = useState("");

  useEffect(() => {
    fetch(`https://thambapanni-backend.onrender.com/api/auth/${guideId}`)
      .then((res) => res.json())
      .then((data) => {
        setGuide(data);
      })
      .catch((err) => console.log(err));
  }, [guideId]);

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format.");
      return;
    } else {
      setEmailError("");
      return;
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    // You can use a regular expression (regex) to validate the phone number format
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validateCardNumberDigits = (cardNumber) => {
    const cardNumberRegex = /^\d{16}$/;
    return cardNumberRegex.test(cardNumber);
  };

  const validateExpiryDateFormat = (expiryDate) => {
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return expiryDateRegex.test(expiryDate);
  };

  const validateCvvDigits = (cvv) => {
    const cvvRegex = /^\d{3}$/;
    return cvvRegex.test(cvv);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the email validation failed
    
    validateEmail();


    if (!phone) {
      setPhoneError("Phone number is required.");
      return;
    } else if (!validatePhoneNumber(phone)) {
      setPhoneError("Invalid phone number. Use a valid format.");
      return;
    }

    if (!cardNumber) {
      setCardNumberError("Card number is required.");
      return;
    } else if (!validateCardNumberDigits(cardNumber)) {
      setCardNumberError("Invalid card number. Must have 16 digits.");
      return;
    }

    if (!expiryDate) {
      setExpiryDateError("Expiry date is required.");
      return;
    } else if (!validateExpiryDateFormat(expiryDate)) {
      setExpiryDateError("Invalid expiry date format. Use MM/YY.");
      return;
    }

    if (!cvv) {
      setCvvError("CVV is required.");
      return;
    } else if (!validateCvvDigits(cvv)) {
      setCvvError("Invalid CVV. Must have 3 digits.");
      return;
    }

    // Submit the form if there are no errors
    try {
      
      const response = await fetch("https://thambapanni-backend.onrender.com/api/booking/Add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`,
          'user_id': user._id
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          tourDate,
          tourLocation,
          groupSize,
          specialRequirements,
          guideId
        }),
      });

  
      const data = await response.json();
  
      console.log("Booking added successfully", data);

      // Display success message using SweetAlert2
      Swal.fire({
        icon: "success",
        title: "Booking created successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error adding booking", error);
      window.alert("Error adding booking");
    }
  
  };


  return (
    <section style={{ margin: '32px 0' }}>
      <Grid container spacing={2} marginTop={10}>
        {guide && (
          <>
            <Grid item xs={12} sm={6}>
              <br/><br/>
              <img
                src={guide.photo}
                alt={guide.firstname}
                style={{ 
                width: '270px',
                height: '270px',
                display: 'block',
                margin: '0 auto',
                borderRadius: '50%' }}
              />
              <br/><br/>
              <Typography variant="h5" style={{ marginBottom: '16px', fontWeight: 'bold', color: '#19376D' }}>
                <center>{guide.firstName} {guide.lastName}</center>
              </Typography>
              <Typography style={{ textAlign: 'justify', fontSize: '1.0rem', backgroundColor: '#ffff' }}>
              <center>{guide.bio}</center>{<br />}
              </Typography>
              <Typography  style={{ textAlign: 'justify', fontSize: '1.0rem', backgroundColor: '#ffff'  }}>
              <center>Charges: {guide.charges}</center>{<br />}
              </Typography>
              <section style={{ display: "flex", alignItems: "center", color: "#19376D", justifyContent: "center" }}>
              <LocalPhoneIcon />
                    <Typography variant="subtitle1" fontWeight="bold">
                        {guide.mobile}
                    </Typography>
                </section>
                <section style={{ display: "flex", alignItems: "center", color: "#19376D", justifyContent: "center" }}>
                    <EmailIcon />
                    <Typography variant="subtitle1" fontWeight="bold">
                        {guide.email}
                    </Typography>
                </section>
            </Grid>
            <Grid item xs={12} sm={6} style={{ backgroundColor: '#ffff' }}>
            
            <Card style={{ backgroundColor: "#F1F6F9"  }} justifyContent="center">
                    <CardContent>
                    <Container maxWidth="sm" style={{marginTop: '20px', marginBottom: '20px'}}>
                        <form onSubmit={handleSubmit} >
                            <Typography variant="h5" style={{ marginBottom: '16px', fontWeight: 'bold', color: '#19376D' }}>
                              <center>Book Now</center>
                            </Typography>
                            <Grid container spacing={2}>
                            <Grid container item spacing={2} xs={12}>
                                    <Grid item xs={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            error={Boolean(emailError)}
                                            helperText={emailError}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container item spacing={2} xs={12}>
                                    <Grid item xs={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            error={Boolean(phoneError)}
                                            helperText={phoneError}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            value={tourDate}
                                            type='date'
                                            onChange={(e) => setTourDate(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container item spacing={2} xs={12}>
                                    <Grid item xs={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Destination"
                                            value={tourLocation}
                                            onChange={(e) => setTourLocation(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Group Size"
                                            value={groupSize}
                                            onChange={(e) => setGroupSize(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item spacing={2} xs={12}>
                                    <TextField
                                        fullWidth
                                        name="requirements"
                                        label="Special Requirements"
                                        margin="normal"
                                        value={specialRequirements}
                                        onChange={(e) => setSpecialRequirements(e.target.value)}
                                    />
                                </Grid>
                          
                            <Typography style={{ fontStyle:'italic', textAlign:'center', marginBottom: '16px', color: '#19376D', display:'flex'}}>
                              <center>You have to pay an advance of 4 USD to book a guide.</center>
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item spacing={2} xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Name on card"
                                        value={nameOnCard}
                                        onChange={(e) => setNameOnCard(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Card number"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        error={Boolean(cardNumberError)}
                                        helperText={cardNumberError}
                                    />
                                </Grid>
                                <Grid container item spacing={2} xs={12}>
                                    <Grid item xs={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Expiry date"
                                            value={expiryDate}
                                            onChange={(e) => setExpiryDate(e.target.value)}
                                            error={Boolean(expiryDateError)}
                                            helperText={expiryDateError}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="CVV"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value)}
                                            error={Boolean(cvvError)}
                                            helperText={cvvError}
                                        />
                                    </Grid>
                                </Grid>
                           
                                </Grid>
                              <Grid item xs={12}>
                                {/* <PayPalScriptProvider 
                                  options={{
                                    "client-id": "AQI8VgpVImEHGWZ51f74S2WmYm4xHLXP3COG9kdkDwXXuN3UuoYP6sx1AocPTGzYHiVOYQ4YlvbauFiA"
                                  }}
                                >
                                  <PayPalButtons
                                    createOrder={(data, actions) => {
                                      return actions.order.create({
                                        purchase_units: [
                                          {
                                            amount: {
                                              value: "4.00",
                                            },
                                          },
                                        ],
                                      });
                                    }}
                                    onApprove={async (data, actions) => {
                                      const details = await actions.order.capture();
                                      const name = details.payer.name.given_name;
                                      alert("Booking completed by " + name);
                                     
                                    }}
                                  />
                                </PayPalScriptProvider> */}
                                </Grid>    
                                <Button type="submit" variant="contained"
                            sx={{ color: 'white', backgroundColor: "#063970", borderColor: 'green', width: '100%', padding: 2, margin: 2, fontWeight: "bold" }}>Submit</Button>
                            </Grid>
                        </form>
                        </Container>
                    </CardContent>
                </Card>
            </Grid>
          </>
        )}
      </Grid>
    </section>
  );
};

export default GuideBooking;