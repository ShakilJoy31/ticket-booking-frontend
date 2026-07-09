# Event Booking System - Server

A robust, production-ready event booking system built with **Node.js (Express.js)**, **MySQL**, and **Redis**. This system handles asynchronous booking processing with Bull queue, prevents overbooking, and ensures data integrity through database transactions and row-level locking.

---

## 🚀 Features

- ✅ **Async Booking Processing** - Fast 202 Accepted response with background queue processing
- ✅ **Overbooking Prevention** - Database row-level locking ensures seat count integrity
- ✅ **Duplicate Request Handling** - Unique requestId constraints prevent duplicate bookings
- ✅ **Real-time Status Updates** - Bookings transition from PENDING → CONFIRMED/FAILED
- ✅ **Event Management** - CRUD operations for events with seat tracking
- ✅ **Comprehensive Filtering** - Paginated bookings with event and status filters
- ✅ **Data Integrity** - ACID transactions with Sequelize and MySQL


---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download](https://www.mysql.com/downloads/)
- **Redis** (v6 or higher) - [Download for Windows](https://github.com/tporadowski/redis/releases) | [Mac/Linux](https://redis.io/download)
- **npm** or **yarn** (comes with Node.js)

---

## ⚙️ Installation

If you visit this drive link you will be able to see a video where I have shown how to run the backend from starting to end. Please follow the link below: 

https://drive.google.com/drive/folders/1CLmq3E1QIrFq60HV5QoKPjJyvGzukx_v?usp=sharing

Or let me guide you how to start the server. Please follow the steps below: 

### 1. Clone the Repository first. 

Open cmd and run 

```bash
git clone https://github.com/ShakilJoy31/ticket-booking-frontend.git
cd ticket-booking-frontend (Nevigate to your server project folder)
```

### 2. Install Dependencies

```bash
npm install or npm i

```

### 3. Start the project (Terminal 1)

```bash
1. Open terminal for the project. 
npm run dev
```

You should see:
```
PS C:\Users\pc\WEB_APPLICATIONS\ticket-booking-system\ticket-booking-system-frontend> npm run dev

> event-booking-system@0.1.0 dev
> next dev

   ▲ Next.js 15.5.19
   - Local:        http://localhost:3000
   - Network:      http://192.168.0.101:3000

 ✓ Starting...
 ✓ Ready in 2.5s

```

### 4. Start the project at production mood (Terminal 1)

```bash
1. Open terminal for the project. 
2. Run npm run build. 

You should see:
```
info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
 ✓ Linting and checking validity of types 
 ✓ Collecting page data    
react-i18next:: useTranslation: You will need to pass in an i18next instance by using initReactI18next { code: 'NO_I18NEXT_INSTANCE' }
 ✓ Generating static pages (7/7)
 ✓ Collecting build traces    
 ✓ Finalizing page optimization    

Route (app)                                 Size  First Load JS    
┌ ○ /                                    3.45 kB         106 kB
├ ○ /_not-found                            126 B         102 kB
├ ○ /bookings                            5.43 kB         181 kB
└ ○ /events                              5.96 kB         182 kB
+ First Load JS shared by all             102 kB
  ├ chunks/255-1aac5df21ceca329.js       46.1 kB
  ├ chunks/4bd1b696-c023c6e3521b1417.js  54.2 kB
  └ other shared chunks (total)          1.99 kB


○  (Static)  prerendered as static content

PS C:\Users\pc\WEB_APPLICATIONS\ticket-booking-system\ticket-booking-system-frontend>


3. If the build is successful run: 
npm start

You should see: 

PS C:\Users\pc\WEB_APPLICATIONS\ticket-booking-system\ticket-booking-system-frontend> npm start

> event-booking-system@0.1.0 start
> next start

   ▲ Next.js 15.5.19
   - Local:        http://localhost:3000
   - Network:      http://192.168.0.101:3000

 ✓ Starting...
 ✓ Ready in 818ms


### 3. Flow Diagram

```
User submits booking with requestId
         ↓
Check if requestId exists in database
         ↓
    ┌────┴────┐
    ↓         ↓
  YES        NO
    ↓         ↓
Return      Create new
existing    booking with
booking     PENDING status
            ↓
          Add to queue
            ↓
          Return 202
```

---

## 👥 Authors

- **Shakidul Islam Shakil** - [GitHub Profile](https://github.com/ShakilJoy31)



