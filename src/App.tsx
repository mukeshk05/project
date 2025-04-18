import React, { useState, useMemo } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, MapPin, Calendar, Users, Search, Star, ArrowRight, Phone, Mail, Clock, Filter, LogIn, UserPlus, LogOut, MessageSquare, History } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import TravelAssistant from './components/TravelAssistant';
import TravelAssistantPage from './components/TravelAssistantPage';
import BookingHistory from './components/BookingHistory';
import AuthButtons from './components/AuthButtons';
import UserMenu from './components/UserMenu';
import AuthCallback from './components/AuthCallback';
import TravelMap from './components/TravelMap';
import DestinationDetail from './components/DestinationDetail';
import TravelSearch from './components/TravelSearch';
import FlightResults from './components/search/FlightResults';
import CarResults from './components/search/CarResults';
import HotelResults from './components/search/HotelResults';
import CruiseResults from './components/search/CruiseResults';
import ChatHistory from './components/ChatHistory';
import AssistantPage from './components/AssistantPage';
import TripPlanner from './components/TripPlanner';
import PackMyBagsAI from './components/PackMyBagsAI';
import GroupTripMode from './components/GroupTripMode';
import TripMemoryMode from './components/TripMemoryMode';
import VoiceToTrip from './components/VoiceToTrip';
import GeoAwareSuggestions from './components/GeoAwareSuggestions';
import TravelInsightsBlog from './components/TravelInsightsBlog';
import MultilingualTravelAssistant from './components/MultilingualTravelAssistant';
import Header from './components/Header';
import SurpriseMeGenerator from './components/SurpriseMeGenerator';
import PreBuiltTravelBundles from './components/PreBuiltTravelBundles';
import CancellationNavigator from './components/CancellationNavigator';
import OfflineTravelMode from './components/OfflineTravelMode';
import PhotoJournalMode from './components/PhotoJournalMode';
import WellnessMode from './components/WellnessMode';
import DigitalNomadToolkit from './components/DigitalNomadToolkit';
import TravelProChat from './components/TravelProChat';
import FlywisePerksStore from './components/FlywisePerksStore';
import AddOnsMarketplace from './components/AddOnsMarketplace';
import AiTripConcierge from './components/AiTripConcierge';
import SocialFeed from './components/SocialFeed';
import ReferralBoost from './components/ReferralBoost';
import MultiDeviceSync from './components/MultiDeviceSync';
import BucketListTracker from './components/BucketListTracker';
import AiVoiceConcierge from './components/AiVoiceConcierge';
import AiPackingOptimizer from './components/AiPackingOptimizer';
import MemoryBasedPlanning from './components/MemoryBasedPlanning';
import FlightDelayPredictor from './components/FlightDelayPredictor';
import TripDnaGenerator from './components/TripDnaGenerator';
import SeasonalTravelCalendar from './components/SeasonalTravelCalendar';
import TravelWidgetApi from './components/TravelWidgetApi';
import TripNewsletter from './components/TripNewsletter';
import TravelScrapbook from './components/TravelScrapbook';
import WeekendEscapeAi from './components/WeekendEscapeAi';
import TravelStyleMatcher from './components/TravelStyleMatcher';
import RealTimeAdvisor from './components/RealTimeAdvisor';
import PricePredictionAI from './components/PricePredictionAI';
import AnnualTripPlanner from './components/AnnualTripPlanner';
import TravelInsuranceAdvisor from './components/TravelInsuranceAdvisor';
import LocalLanguageConcierge from './components/LocalLanguageConcierge';
import EmotionAwareTravelRecommendations from './components/EmotionAwareTravelRecommendations';
import AIExperienceBuilder from './components/AIExperienceBuilder';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<TravelSearch />} />
        <Route path="/flights" element={<FlightResults />} />
        <Route path="/cars" element={<CarResults />} />
        <Route path="/hotels" element={<HotelResults />} />
        <Route path="/cruises" element={<CruiseResults />} />
        <Route path="/map" element={<TravelMap />} />
        <Route path="/destination/:id" element={<DestinationDetail />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/history" element={<ChatHistory />} />
        <Route path="/bookings" element={<BookingHistory />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/trip-planner" element={<TripPlanner />} />
        <Route path="/pack-my-bags" element={<PackMyBagsAI />} />
        <Route path="/group-trip" element={<GroupTripMode />} />
        <Route path="/trip-memories" element={<TripMemoryMode />} />
        <Route path="/voice-to-trip" element={<VoiceToTrip />} />
        <Route path="/nearby" element={<GeoAwareSuggestions />} />
        <Route path="/blog" element={<TravelInsightsBlog />} />
        <Route path="/multilingual-assistant" element={<MultilingualTravelAssistant />} />
        <Route path="/surprise-me" element={<SurpriseMeGenerator />} />
        <Route path="/travel-bundles" element={<PreBuiltTravelBundles />} />
        <Route path="/cancellation" element={<CancellationNavigator />} />
        <Route path="/offline-mode" element={<OfflineTravelMode />} />
        <Route path="/photo-journal" element={<PhotoJournalMode />} />
        <Route path="/wellness" element={<WellnessMode />} />
        <Route path="/digital-nomad" element={<DigitalNomadToolkit />} />
        <Route path="/travel-pro" element={<TravelProChat />} />
        <Route path="/perks-store" element={<FlywisePerksStore />} />
        <Route path="/add-ons" element={<AddOnsMarketplace />} />
        <Route path="/ai-concierge" element={<AiTripConcierge />} />
        <Route path="/social-feed" element={<SocialFeed />} />
        <Route path="/referral-boost" element={<ReferralBoost />} />
        <Route path="/multi-device-sync" element={<MultiDeviceSync />} />
        <Route path="/bucket-list" element={<BucketListTracker />} />
        <Route path="/voice-concierge" element={<AiVoiceConcierge />} />
        <Route path="/packing-optimizer" element={<AiPackingOptimizer />} />
        <Route path="/memory-planning" element={<MemoryBasedPlanning />} />
        <Route path="/flight-delay-predictor" element={<FlightDelayPredictor />} />
        <Route path="/trip-dna" element={<TripDnaGenerator />} />
        <Route path="/seasonal-calendar" element={<SeasonalTravelCalendar />} />
        <Route path="/widget-api" element={<TravelWidgetApi />} />
        <Route path="/trip-newsletter" element={<TripNewsletter />} />
        <Route path="/travel-scrapbook" element={<TravelScrapbook />} />
        <Route path="/weekend-escape" element={<WeekendEscapeAi />} />
        <Route path="/travel-style" element={<TravelStyleMatcher />} />
        <Route path="/real-time-advisor" element={<RealTimeAdvisor />} />
        <Route path="/price-prediction" element={<PricePredictionAI />} />
        <Route path="/annual-trip-planner" element={<AnnualTripPlanner />} />
        <Route path="/travel-insurance" element={<TravelInsuranceAdvisor />} />
        <Route path="/language-concierge" element={<LocalLanguageConcierge />} />
        <Route path="/emotion-recommendations" element={<EmotionAwareTravelRecommendations />} />
        <Route path="/experience-builder" element={<AIExperienceBuilder />} />
      </Routes>
    </>
  );
}

export default App;