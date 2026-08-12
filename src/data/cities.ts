export type City = {
    id: number;
    city: string;
    province: string;
    area: "Nord Sardegna" | "Centro Sardegna" | "Sud Sardegna";
  };
  
  export const cities: City[] = [
    // =========================
    // NORD SARDEGNA
    // =========================
  
    { id: 1, city: "Alghero", province: "SS", area: "Nord Sardegna" },
    { id: 2, city: "Arzachena", province: "SS", area: "Nord Sardegna" },
    { id: 33, city: "Berchidda", province: "SS", area: "Nord Sardegna" },
    { id: 3, city: "Budoni", province: "SS", area: "Nord Sardegna" },
    { id: 4, city: "Castelsardo", province: "SS", area: "Nord Sardegna" },
    { id: 36, city: "Golfo Aranci", province: "SS", area: "Nord Sardegna" },
    { id: 5, city: "La Maddalena", province: "SS", area: "Nord Sardegna" },
    { id: 6, city: "Olbia", province: "SS", area: "Nord Sardegna" },
    { id: 32, city: "Osilo", province: "SS", area: "Nord Sardegna" },
    { id: 7, city: "Palau", province: "SS", area: "Nord Sardegna" },
    { id: 8, city: "Porto Torres", province: "SS", area: "Nord Sardegna" },
    { id: 9, city: "San Teodoro", province: "SS", area: "Nord Sardegna" },
    { id: 10, city: "Santa Teresa Gallura", province: "SS", area: "Nord Sardegna" },
    { id: 11, city: "Sassari", province: "SS", area: "Nord Sardegna" },
    { id: 12, city: "Sorso", province: "SS", area: "Nord Sardegna" },
    { id: 13, city: "Stintino", province: "SS", area: "Nord Sardegna" },
    { id: 14, city: "Tempio Pausania", province: "SS", area: "Nord Sardegna" },
    { id: 34, city: "Tergu", province: "SS", area: "Nord Sardegna" },
    { id: 37, city: "Torralba", province: "SS", area: "Nord Sardegna" },

    // =========================
    // CENTRO SARDEGNA
    // =========================
  
    { id: 15, city: "Bosa", province: "OR", area: "Centro Sardegna" },
    { id: 16, city: "Dorgali", province: "NU", area: "Centro Sardegna" },
    { id: 17, city: "Fonni", province: "NU", area: "Centro Sardegna" },
    { id: 18, city: "Macomer", province: "NU", area: "Centro Sardegna" },
    { id: 19, city: "Nuoro", province: "NU", area: "Centro Sardegna" },
    { id: 20, city: "Orgosolo", province: "NU", area: "Centro Sardegna" },
    { id: 21, city: "Oristano", province: "OR", area: "Centro Sardegna" },
    { id: 22, city: "Orosei", province: "NU", area: "Centro Sardegna" },
    { id: 35, city: "Siniscola", province: "NU", area: "Centro Sardegna" },
    { id: 23, city: "Tortolì", province: "NU", area: "Centro Sardegna" },
  
    // =========================
    // SUD SARDEGNA
    // =========================
  
    { id: 24, city: "Cagliari", province: "CA", area: "Sud Sardegna" },
    { id: 25, city: "Carbonia", province: "SU", area: "Sud Sardegna" },
    { id: 26, city: "Carloforte", province: "SU", area: "Sud Sardegna" },
    { id: 27, city: "Iglesias", province: "SU", area: "Sud Sardegna" },
    { id: 28, city: "Pula", province: "CA", area: "Sud Sardegna" },
    { id: 29, city: "Quartu Sant'Elena", province: "CA", area: "Sud Sardegna" },
    { id: 30, city: "Sant'Antioco", province: "SU", area: "Sud Sardegna" },
    { id: 31, city: "Villasimius", province: "CA", area: "Sud Sardegna" },
  ];