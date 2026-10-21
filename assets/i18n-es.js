/* VoterLens — Spanish Phase 1 (interface & instructions only).
   Ballot content — race titles, candidate names/bios, measure text, scorecard
   data, FEC layers — stays in English exactly as on the official ballot.
   This file translates the site chrome and scaffolding strings by exact-match
   against rendered text, so no ballot data file is touched. */
(function () {
  "use strict";

  var STORAGE_KEY = "vl-lang";
  var NOTE_ES = "Toda la guía y las instrucciones están en español. El contenido de la boleta (cargos, candidatos y medidas) se muestra en inglés, tal como aparece en la boleta oficial.";

  var ES = {
    /* ---- document / header / nav ---- */
    "VoterLens — Oregon Constitutional Scorecard": "VoterLens — Tarjeta de puntuación constitucional de Oregón",
    "Oregon Constitutional Scorecard": "Tarjeta de puntuación constitucional de Oregón",
    "Exit": "Salir",
    "Get App": "Obtener la app",
    "Share": "Compartir",
    "Share VoterLens": "Compartir VoterLens",
    "Add VoterLens to your home screen": "Añadir VoterLens a la pantalla de inicio",
    "Be a citizen, not a subject.": "Sea un ciudadano, no un súbdito.",
    "Fill out your ballot without guessing.": "Complete su boleta sin adivinar.",
    "Your Ballot": "Su boleta",
    "Lawmaker Grades": "Calificaciones de legisladores",
    "Key Votes": "Votaciones clave",
    "Find Your Match": "Encuentre su afinidad",
    "Measure Guide": "Guía de medidas",
    "How It Works": "Cómo funciona",
    "Give Feedback": "Enviar comentarios",
    "Give feedback": "Enviar comentarios",
    "Main sections": "Secciones principales",
    "Scorecard sections": "Secciones de la tarjeta de puntuación",
    "Patent pending": "Patente pendiente",
    "Found this useful? Send it to a friend you’d like to see vote knowledgeably — tap the Share button in the top right corner to text or email it, or copy the link below.": "¿Le pareció útil? Envíeselo a un amigo que quiera votar con conocimiento: toque el botón Compartir en la esquina superior derecha para enviarlo por mensaje de texto o correo electrónico, o copie el enlace a continuación.",
    "Found this useful? Send it to a friend you’d like to see vote knowledgeably — tap the three dots (⋯) in the top right corner and hit Share to text or email it, or copy the link below.": "¿Le pareció útil? Envíeselo a un amigo que quiera votar con conocimiento: toque los tres puntos (⋯) en la esquina superior derecha y pulse Compartir para enviarlo por mensaje de texto o correo electrónico, o copie el enlace a continuación.",
    "Know someone who dreads the voter pamphlet? Send them their ballot:": "¿Conoce a alguien que le tema al folleto del votante? Envíele su boleta:",
    "When you’re finished, just hit Exit.": "Cuando termine, simplemente pulse Salir.",
    "You can close this page now.": "Ya puede cerrar esta página.",
    "Leaving VoterLens… If this page stays open, use your browser’s Back button.": "Saliendo de VoterLens… Si esta página permanece abierta, use el botón Atrás de su navegador.",
    "Use your browser’s Back button to leave VoterLens.": "Use el botón Atrás de su navegador para salir de VoterLens.",
    "Link copied — paste it anywhere to share": "Enlace copiado: péguelo donde quiera para compartirlo",
    "Copy was blocked — press and hold the link at the bottom of the page to copy it.": "La copia fue bloqueada: mantenga presionado el enlace al final de la página para copiarlo.",
    "Tap Share, then \"Add to Home Screen\".": "Toque Compartir y luego «Añadir a la pantalla de inicio».",
    "Tap ⋮ (menu), then \"Add to Home screen\".": "Toque ⋮ (menú) y luego «Añadir a la pantalla de inicio».",

    /* ---- voting method chooser ---- */
    "How are you voting?": "¿Cómo va a votar?",
    "Choose the experience that fits what you are doing right now.": "Elija la experiencia que corresponde a lo que está haciendo ahora mismo.",
    "Vote by mail": "Votar por correo",
    "Research each race and fill out your ballot at the kitchen table.": "Investigue cada contienda y complete su boleta en casa.",
    "Going to the polls — get me ready": "Voy a ir a votar en persona: quiero prepararme",
    "Research your ballot and build a personal pick list before you leave.": "Investigue su boleta y haga una lista personal de selecciones antes de salir.",
    "At the polls now": "Ya estoy en el lugar de votación",
    "Use a minimal, step-by-step view of your saved picks.": "Use una vista mínima, paso a paso, de sus selecciones guardadas.",

    /* ---- ballot lookup ---- */
    "Find your local ballot": "Encuentre su boleta local",
    "Start with your ZIP code. If more than one ballot is possible, you can choose the area that matches where you live.": "Comience con su código postal. Si es posible más de una boleta, puede elegir la zona que corresponde a donde vive.",
    "ZIP code": "Código postal",
    "5-digit ZIP code": "Código postal de 5 dígitos",
    "Find possible ballots": "Buscar boletas posibles",
    "A ZIP code is enough to start. You only need to enter a street address if you cannot identify your ballot from the choices.": "Un código postal basta para empezar. Solo necesita ingresar la dirección de su calle si no puede identificar su boleta entre las opciones.",
    "Did you know?": "¿Sabía esto?",
    "In Oregon, a felony conviction only blocks voting": "En Oregón, una condena por delito grave solo impide votar",
    "while you are incarcerated": "mientras está encarcelado",
    ". Your right to vote is restored the day you are released — even while on parole or probation. You do need to": ". Su derecho a votar se restablece el día en que sale en libertad, incluso durante la libertad condicional o la supervisión. Sí necesita",
    "re-register": "volver a registrarse",
    "Register at the Oregon Secretary of State": "Regístrese en la Secretaría de Estado de Oregón",
    "Not sure which choice is yours?": "¿No está seguro de cuál opción es la suya?",
    "Enter your street address for an exact match": "Ingrese la dirección de su calle para una coincidencia exacta",
    "Use your full address": "Use su dirección completa",
    "Enter the street address only when the ZIP-code choices are not enough.": "Ingrese la dirección de la calle solo cuando las opciones del código postal no sean suficientes.",
    "Street address": "Dirección",
    "Example: 123 Main Street": "Ejemplo: 123 Main Street",
    "ZIP code for exact address": "Código postal para la dirección exacta",
    "Match my address": "Buscar mi dirección",
    "Your address is used only for this lookup and is never saved.": "Su dirección se usa solo para esta búsqueda y nunca se guarda.",
    "Enter a 5-digit ZIP code to continue.": "Ingrese un código postal de 5 dígitos para continuar.",
    "Enter your street address to continue.": "Ingrese la dirección de su calle para continuar.",
    "Your address was not saved. Choose the district or ward shown on your official voter record; this preview does not yet resolve every street boundary automatically.": "Su dirección no se guardó. Elija el distrito que aparece en su registro oficial de votante; esta vista previa aún no resuelve automáticamente todos los límites de calles.",

    /* ---- coverage demo / polk notice ---- */
    "Your city is coming soon": "Su ciudad llegará pronto",
    "We have not compiled a ballot for": "Todavía no hemos compilado una boleta para",
    "yet. You can join the waitlist, request your city, or try the full guide with one of these covered ZIP codes.": "Puede unirse a la lista de espera, solicitar su ciudad o probar la guía completa con uno de estos códigos postales cubiertos.",
    "Sample covered ZIP codes": "Ejemplos de códigos postales cubiertos",
    "Want your own city next?": "¿Quiere que su ciudad sea la siguiente?",
    "Email us to request it and join the coverage waitlist.": "Envíenos un correo para solicitarla y unirse a la lista de espera de cobertura.",
    "Request my city": "Solicitar mi ciudad",
    "Preview a ballot:": "Vista previa de una boleta:",
    "West Salem / Polk County coverage is coming": "La cobertura de West Salem / condado de Polk llegará pronto",
    "This ballot pathway is not built yet, so VoterLens will not show races or a candidate quiz for West Salem / Polk County until the coverage is complete.": "Esta guía de boleta aún no está construida, por lo que VoterLens no mostrará contiendas ni un cuestionario de candidatos para West Salem / condado de Polk hasta que la cobertura esté completa.",
    "Choose another Salem-area pathway": "Elegir otra guía de la zona de Salem",

    /* ---- confirm scaffolding ---- */
    "Confirm your City Council ward": "Confirme su distrito del Concejo Municipal",
    "Confirm your Albany council ward": "Confirme su distrito del Concejo de Albany",
    "Is this address inside Cottage Grove city limits?": "¿Está esta dirección dentro de los límites de la ciudad de Cottage Grove?",
    "Use the official rule below. If your home is on a boundary street, check the": "Use la regla oficial a continuación. Si su casa está en una calle límite, consulte el",
    "official ward map on pages 4–5": "mapa oficial de distritos en las páginas 4–5",
    "before choosing.": "antes de elegir.",
    "Boundary source:": "Fuente de los límites:",
    "Ward description and election source:": "Descripción del distrito y fuente electoral:",
    "Inside city limits": "Dentro de los límites de la ciudad",
    "Outside city limits": "Fuera de los límites de la ciudad",
    "Confirm this address": "Confirme esta dirección",
    "Show this ballot": "Mostrar esta boleta",
    "Start over": "Empezar de nuevo",
    "Tip: your county mailed you a voter notification card when you registered — it shows your precinct, which determines your ward. Lost it? Your county elections office will mail you a new one.": "Consejo: su condado le envió por correo una tarjeta de notificación al votante cuando se registró; muestra su precinto, que determina su distrito. ¿La perdió? La oficina electoral de su condado le enviará una nueva.",
    "Choose each district and city shown on your voter record or printed ballot.": "Elija cada distrito y ciudad que aparecen en su registro de votante o en su boleta impresa.",
    "Choose each item shown on your voter record or printed ballot.": "Elija cada elemento que aparece en su registro de votante o en su boleta impresa.",
    "Choose the city, county, State Senate district, and State House district shown on the voter record or printed ballot.": "Elija la ciudad, el condado, el distrito del Senado estatal y el distrito de la Cámara estatal que aparecen en el registro de votante o en la boleta impresa.",
    "Choose the State House district and the Corvallis ward (or outside city limits) shown on your voter record or printed ballot.": "Elija el distrito de la Cámara estatal y el distrito del Concejo de Corvallis (o fuera de los límites de la ciudad) que aparecen en su registro de votante o en su boleta impresa.",
    "This pathway cannot safely build your ballot until the House district is confirmed.": "Esta guía no puede preparar su boleta de forma segura hasta que se confirme el distrito de la Cámara.",
    "This pathway cannot safely build your ballot until the State House district is confirmed. It is printed on your ballot and shown on your voter record.": "Esta guía no puede preparar su boleta de forma segura hasta que se confirme el distrito de la Cámara estatal. Está impreso en su boleta y aparece en su registro de votante.",
    "This pathway cannot safely build your ballot until the congressional and legislative districts are confirmed on your voter record or printed ballot.": "Esta guía no puede preparar su boleta de forma segura hasta que los distritos del Congreso y de la legislatura se confirmen en su registro de votante o en su boleta impresa.",
    "This pathway cannot safely choose between House District 5 and 6 until the district is confirmed.": "Esta guía no puede elegir de forma segura entre el Distrito 5 y el Distrito 6 de la Cámara hasta que se confirme el distrito.",
    "This address is outside the verified district pathway or still uncertain. Compare the official district tools before using this ballot guide.": "Esta dirección está fuera de la guía de distritos verificada o aún es incierta. Compare las herramientas oficiales de distritos antes de usar esta guía de boleta.",
    "This address is outside the verified pathway or still uncertain. Compare the printed ballot or official district tools before using a local ballot here.": "Esta dirección está fuera de la guía verificada o aún es incierta. Compare la boleta impresa o las herramientas oficiales de distritos antes de usar una boleta local aquí.",
    "This compiled Eugene pathway currently covers Ward 7 only. Use the official ward lookup and compare another ward’s printed ballot before continuing.": "Esta guía compilada de Eugene actualmente cubre solo el Distrito 7. Use el buscador oficial de distritos y compare la boleta impresa de otro distrito antes de continuar.",
    "This Keizer pathway is in Marion County. Recheck the location before continuing.": "Esta guía de Keizer está en el condado de Marion. Vuelva a verificar la ubicación antes de continuar.",
    "Choose one": "Elija una opción",
    "Choose ward": "Elija el distrito",
    "U.S. House district": "Distrito de la Cámara de los EE. UU.",
    "State Senate district": "Distrito del Senado estatal",
    "State House district": "Distrito de la Cámara estatal",
    "House district": "Distrito de la Cámara",
    "County Commission district": "Distrito de la Comisión del Condado",
    "City Council ward": "Distrito del Concejo Municipal",
    "City / area": "Ciudad / zona",
    "City": "Ciudad",
    "County": "Condado",
    "Location": "Ubicación",
    "Districts": "Distritos",
    "Area": "Zona",
    "Eugene council ward": "Distrito del concejo de Eugene",
    "Medford council ward": "Distrito del concejo de Medford",
    "Woodburn council ward": "Distrito del concejo de Woodburn",
    "Corvallis City Council ward": "Distrito del Concejo Municipal de Corvallis",
    "Roseburg City Council ward": "Distrito del Concejo Municipal de Roseburg",
    "Klamath Falls City Council ward": "Distrito del Concejo Municipal de Klamath Falls",
    "Grants Pass council ward (Grants Pass voters only)": "Distrito del concejo de Grants Pass (solo votantes de Grants Pass)",
    "McMinnville council ward (McMinnville voters only)": "Distrito del concejo de McMinnville (solo votantes de McMinnville)",
    "Not sure": "No estoy seguro",
    "Not sure / skip": "No estoy seguro / omitir",
    "Not sure / different districts": "No estoy seguro / distritos diferentes",
    "Not sure / different area": "No estoy seguro / otra zona",
    "Not sure / another ward": "No estoy seguro / otro distrito",
    "Not sure / another district": "No estoy seguro / otro distrito",
    "Not sure / another community": "No estoy seguro / otra comunidad",
    "Not sure / House District 23": "No estoy seguro / Distrito 23 de la Cámara",
    "Not sure — omit the ward-specific race": "No estoy seguro: omitir la contienda específica del distrito",
    "Not sure — omit the ward race": "No estoy seguro: omitir la contienda del distrito",
    "Not sure - stop and check": "No estoy seguro: deténgase y verifique",
    "Inside Corvallis, but not sure of the ward": "Dentro de Corvallis, pero no estoy seguro del distrito",
    "Inside Klamath Falls, but not sure of the ward": "Dentro de Klamath Falls, pero no estoy seguro del distrito",
    "Inside Roseburg, but not sure of the ward": "Dentro de Roseburg, pero no estoy seguro del distrito",

    /* ---- ballot result scaffolding ---- */
    "Your November 3, 2026 ballot": "Su boleta del 3 de noviembre de 2026",
    "Voting districts": "Distritos electorales",
    "Check these items against the printed ballot": "Verifique estos puntos con la boleta impresa",
    "Items to check against the printed ballot": "Puntos para verificar con la boleta impresa",
    "Three items to check against the printed ballot": "Tres puntos para verificar con la boleta impresa",
    "Coverage:": "Cobertura:",
    "Council ward not selected": "Distrito del concejo no seleccionado",
    "The ward-specific council race is omitted because the ward was not confirmed.": "La contienda del concejo específica del distrito se omite porque el distrito no fue confirmado.",
    "The ward-specific council race is not shown.": "La contienda del concejo específica del distrito no se muestra.",
    "Open the official ward information": "Abrir la información oficial del distrito",
    "or confirm the ward on the printed ballot.": "o confirme el distrito en la boleta impresa.",
    "Ballot measure": "Medida electoral",
    "Ballot measures": "Medidas electorales",
    "YES means": "SÍ significa",
    "NO means": "NO significa",
    "No ballot measure was confirmed for this pathway.": "No se confirmó ninguna medida electoral para esta guía.",
    "Compare this with the printed ballot because a small local district measure may depend on the address.": "Compare esto con la boleta impresa, porque una medida de un distrito local pequeño puede depender de la dirección.",
    "What they’re about": "Acerca de su candidatura",
    "Research gap:": "Falta de información:",
    "Sources": "Fuentes",
    "Research completed October 8–14, 2026. Ballot and boundary warnings above remain active until checked against the printed ballot.": "Investigación completada del 8 al 14 de octubre de 2026. Las advertencias sobre la boleta y los límites anteriores siguen vigentes hasta que se verifiquen con la boleta impresa.",
    "Did this guide help?": "¿Le ayudó esta guía?",
    "Grade its effectiveness and tell us what should be clearer.": "Califique su eficacia y díganos qué debería ser más claro.",
    
    "1. SB 243 — Rapid-fire activators ban; public-building carry limits": "1. SB 243 — Prohibición de activadores de disparo rápido; límites para portar armas en edificios públicos",
    "Creates new crimes (up to 10 years prison) for making, moving, or possessing \"rapid-fire activators\" like bump stocks, and lets cities, counties, and special districts ban concealed-handgun license holders from carrying in public meeting buildings. Also changes when Ballot Measure 114 takes effect.": "Crea nuevos delitos (hasta 10 años de prisión) por fabricar, mover o poseer «activadores de disparo rápido» como los bump stocks, y permite que ciudades, condados y distritos especiales prohíban que los titulares de licencias de portación oculta lleven armas en edificios de reuniones públicas. También cambia la fecha de entrada en vigor de la Medida Electoral 114.",
    "2. HB 3054 — Rent control in manufactured-home parks and marinas": "2. HB 3054 — Control de alquileres en parques de casas prefabricadas y marinas",
    "Caps annual rent increases for spaces in larger manufactured-home parks and marinas, and limits rent increases when a home is sold or transferred.": "Limita los aumentos anuales del alquiler de espacios en los parques de casas prefabricadas y marinas más grandes, y limita los aumentos del alquiler cuando una casa se vende o se transfiere.",
    "3. HB 2385 — 340B prescription-drug program mandates": "3. HB 2385 — Mandatos del programa de medicamentos con receta 340B",
    "Restricts how drug manufacturers and pharmacy benefit managers may limit 340B-discounted drugs at contract pharmacies, and shields hospitals' 340B discount revenue.": "Restringe cómo los fabricantes de medicamentos y los administradores de beneficios farmacéuticos pueden limitar los medicamentos con descuento 340B en las farmacias contratadas, y protege los ingresos por descuento 340B de los hospitales.",
    "4. SB 5516 — $11.36 billion K-12 school funding": "4. SB 5516 — Financiamiento escolar K-12 de $11.36 mil millones",
    "Appropriates a record $11.36 billion in state funds for K-12 public education for the 2025–27 budget period.": "Asigna una cifra récord de $11.36 mil millones en fondos estatales para la educación pública K-12 en el período presupuestario 2025–27.",
    "5. SB 551 — Bans on single-use and reusable plastic items": "5. SB 551 — Prohibiciones de artículos de plástico de un solo uso y reutilizables",
    "Phases out certain single-use and reusable plastic items — checkout bags and items provided by lodging and food-service businesses.": "Elimina gradualmente ciertos artículos de plástico de un solo uso y reutilizables: bolsas de tienda y artículos proporcionados por negocios de alojamiento y servicios de comida.",
    "6. SB 827 — Expanded solar and energy-storage rebates": "6. SB 827 — Reembolsos ampliados para energía solar y almacenamiento de energía",
    "Expands Oregon's Solar and Storage Rebate Program, paying taxpayer-funded rebates for home solar panels and battery systems.": "Amplía el Programa de Reembolsos para Energía Solar y Almacenamiento de Oregón, pagando con fondos de los contribuyentes reembolsos por paneles solares domésticos y sistemas de baterías.",
    "7. HB 2530 — School-bus stop-arm cameras": "7. HB 2530 — Cámaras en los brazos de parada de los autobuses escolares",
    "Expands the use of cameras mounted on school-bus stop arms to automatically issue traffic citations.": "Amplía el uso de cámaras instaladas en los brazos de parada de los autobuses escolares para emitir automáticamente multas de tráfico.",
    "8. SB 1014 — Translated party statements in the voters' pamphlet": "8. SB 1014 — Declaraciones de partidos traducidas en el folleto del votante",
    "Requires county and state websites to publish translated versions of political parties' statements from the voters' pamphlet.": "Exige que los sitios web del condado y del estado publiquen versiones traducidas de las declaraciones de los partidos políticos del folleto del votante.",
    "9. HB 2586 — In-state tuition for asylum seekers": "9. HB 2586 — Matrícula estatal para solicitantes de asilo",
    "Allows students seeking asylum to pay lower in-state tuition at Oregon public universities and OHSU.": "Permite que los estudiantes que buscan asilo paguen la matrícula estatal, más baja, en las universidades públicas de Oregón y en OHSU.",
    "10. HB 3792 — Doubled energy-bill surcharge for low-income aid": "10. HB 3792 — Recargo duplicado en la factura de energía para ayuda a personas de bajos ingresos",
    "Doubles the minimum surcharge collected from electric customers to fund low-income energy bill assistance.": "Duplica el recargo mínimo cobrado a los clientes de electricidad para financiar la ayuda con las facturas de energía de personas de bajos ingresos.",
    "11. SB 1587 — Limits on sharing data for immigration enforcement": "11. SB 1587 — Límites para compartir datos con fines de control migratorio",
    "Bars public bodies from sharing personal data with data brokers unless the broker promises it won't be used for federal immigration enforcement.": "Prohíbe que los organismos públicos compartan datos personales con corredores de datos, a menos que el corredor prometa que no se usarán para el control federal de inmigración.",
    "12. HB 4145 — Delays Measure 114 gun law to 2028": "12. HB 4145 — Retrasa la ley de armas de la Medida 114 hasta 2028",
    "Pushes implementation of voter-passed Measure 114 (magazine capacity limits, purchase permits) to January 1, 2028, while the Oregon Supreme Court reviews the law.": "Retrasa la implementación de la Medida 114 aprobada por los votantes (límites de capacidad de cargadores, permisos de compra) hasta el 1 de enero de 2028, mientras la Corte Suprema de Oregón revisa la ley.",
  };

  Object.assign(ES, {
    /* ---- shared quiz scaffolding / tendency labels ---- */
    "Your broad tendency": "Su tendencia general",
    "Libertarian-leaning": "Tendencia libertaria",
    "Conservative-leaning": "Tendencia conservadora",
    "Conservative": "Conservadora",
    "Communitarian": "Comunitaria",
    "Civil-liberties leaning": "Tendencia pro libertades civiles",
    "Community-investment leaning": "Tendencia de inversión comunitaria",
    "Law-and-order leaning": "Tendencia de ley y orden",
    "Liberal / progressive": "Liberal / progresista",
    "Centrist / independent": "Centrista / independiente",
    "Mixed / independent": "Mixta / independiente",
    "Not enough votes": "No hay suficientes votos",
    "Agree": "De acuerdo",
    "Disagree": "En desacuerdo",
    "Yes": "Sí",
    "Skip": "Omitir",
    "Clear answers": "Borrar respuestas",
    "Clear": "Borrar",

    /* ---- candidate quiz (ballot-tied) scaffolding ---- */
    "Compare your priorities with documented candidate positions": "Compare sus prioridades con las posiciones documentadas de los candidatos",
    "Answer six questions. The result names only direct, sourced overlaps. It does not infer a position from party or turn one quote into a percentage.": "Responda seis preguntas. El resultado muestra solo coincidencias directas y con fuentes. No infiere una posición a partir del partido ni convierte una cita en un porcentaje.",
    "See documented overlaps": "Ver coincidencias documentadas",
    "Answer at least 4 questions to see documented overlaps.": "Responda al menos 4 preguntas para ver las coincidencias documentadas.",
    "Libertarian-leaning is reported separately from conservative-leaning when your answers combine government restraint with personal liberty.": "La tendencia libertaria se informa por separado de la tendencia conservadora cuando sus respuestas combinan moderación del gobierno con libertad personal.",
    "No candidate has four directly documented positions on these six questions, so the guide does not show a percentage. These are the sourced comparisons available:": "Ningún candidato tiene cuatro posiciones documentadas directamente sobre estas seis preguntas, por lo que la guía no muestra un porcentaje. Estas son las comparaciones con fuentes disponibles:",
    "All other candidates:": "Todos los demás candidatos:",
    "not enough direct, verified issue positions were found. No match is inferred from party or biography.": "no se encontraron suficientes posiciones directas y verificadas sobre los temas. No se infiere ninguna coincidencia a partir del partido o la biografía.",

    /* ---- expanded (area) quiz scaffolding ---- */
    "Compare your priorities with documented positions": "Compare sus prioridades con las posiciones documentadas",
    "Find your lean": "Encuentre su tendencia",
    "Answer these five broad questions. Results show only direct, sourced overlaps on this ballot—not a score, prediction, or party-based assumption.": "Responda estas cinco preguntas generales. Los resultados muestran solo coincidencias directas y con fuentes en esta boleta, no una puntuación, predicción ni suposición basada en el partido.",
    "1. Should government prioritize affordable housing and services that move people into stable housing?": "1. ¿Debería el gobierno dar prioridad a la vivienda asequible y a los servicios que ayudan a las personas a conseguir una vivienda estable?",
    "2. Should government restrain taxes, fees, regulation, and budget growth?": "2. ¿Debería el gobierno contener los impuestos, las tarifas, la regulación y el crecimiento del presupuesto?",
    "3. Should government expand health, behavioral-health, or addiction-care access?": "3. ¿Debería el gobierno ampliar el acceso a la salud, la salud conductual o la atención de adicciones?",
    "4. Should public safety and tougher enforcement be a top priority?": "4. ¿Deberían la seguridad pública y una aplicación más estricta de la ley ser una prioridad principal?",
    "5. Should personal freedom usually outweigh new government restrictions?": "5. ¿Debería la libertad personal pesar normalmente más que las nuevas restricciones del gobierno?",
    "Compared with candidates who explicitly addressed housing.": "Comparado con los candidatos que hablaron explícitamente de la vivienda.",
    "Compared with candidates who explicitly addressed fiscal restraint.": "Comparado con los candidatos que hablaron explícitamente de la moderación fiscal.",
    "Compared with candidates who explicitly addressed health-care access.": "Comparado con los candidatos que hablaron explícitamente del acceso a la atención médica.",
    "Compared with candidates who explicitly addressed public safety or criminal penalties.": "Comparado con los candidatos que hablaron explícitamente de la seguridad pública o las sanciones penales.",
    "This helps distinguish libertarian-leaning answers from conservative answers.": "Esto ayuda a distinguir las respuestas de tendencia libertaria de las respuestas conservadoras.",
    "Compare documented positions": "Comparar posiciones documentadas",
    "Answer at least 2 questions to compare documented positions.": "Responda al menos 2 preguntas para comparar posiciones documentadas.",
    "This label reflects the balance between your answers on government restraint, enforcement, and personal freedom. Libertarian-leaning is reported separately from conservative-leaning.": "Esta etiqueta refleja el equilibrio entre sus respuestas sobre la moderación del gobierno, la aplicación de la ley y la libertad personal. La tendencia libertaria se informa por separado de la tendencia conservadora.",
    "Documented comparisons on this ballot": "Comparaciones documentadas en esta boleta",
    "No direct candidate comparison is available": "No hay una comparación directa de candidatos disponible",
    "The candidates on this ballot do not have a sourced position on the questions you answered.": "Los candidatos en esta boleta no tienen una posición con fuentes sobre las preguntas que usted respondió.",
    "Candidates not listed here lacked a direct, verified position on your answered questions. No match is inferred from party, biography, or silence.": "Los candidatos que no aparecen aquí no tenían una posición directa y verificada sobre las preguntas que respondió. No se infiere ninguna coincidencia a partir del partido, la biografía o el silencio.",
    "Answer these 12 candidate-dividing questions. There are no ballot measures in this pathway. Not sure scores nothing, and unsupported party assumptions are not scored.": "Responda estas 12 preguntas que dividen a los candidatos. En esta guía no hay medidas electorales. «No estoy seguro» no suma puntos, y no se puntúan las suposiciones sobre partidos sin fundamento.",
    "Choose at least one position before comparing.": "Elija al menos una posición antes de comparar.",
    "Your candidate alignment": "Su alineación con los candidatos",
    "Closest documented alignments": "Coincidencias documentadas más cercanas",
    "No candidate on this selected ballot has a verified mapping to the positions you chose. Inference-only options are deliberately not scored.": "Ningún candidato en esta boleta seleccionada tiene una correspondencia verificada con las posiciones que eligió. Las opciones basadas solo en inferencias no se puntúan deliberadamente.",
    "Candidates not listed either had no verified position on your selected answers or did not appear in the selected district pathway. This is a comparison of sourced positions, not an endorsement or prediction.": "Los candidatos que no aparecen no tenían una posición verificada sobre sus respuestas seleccionadas o no aparecían en la guía de distrito seleccionada. Esta es una comparación de posiciones con fuentes, no un respaldo ni una predicción.",

    /* ---- match quiz scaffolding ---- */
    "Find your political match": "Encuentre su afinidad política",
    "Take a position on the same 12 Oregon bills used in the scorecard. You’ll get a broad political tendency and the lawmakers whose recorded votes most closely match your answers.": "Tome una posición sobre los mismos 12 proyectos de ley de Oregón usados en la tarjeta de puntuación. Obtendrá una tendencia política general y los legisladores cuyos votos registrados coinciden más con sus respuestas.",
    "This is an educational snapshot, not a scientific personality test.": "Esto es una muestra educativa, no una prueba científica de personalidad.",
    "You can skip any question you are unsure about.": "Puede omitir cualquier pregunta de la que no esté seguro.",
    "0 of 12 answered": "0 de 12 respondidas",
    "See my result": "Ver mi resultado",
    "Take a position on at least 6 bills, including 2 personal-liberty questions.": "Tome una posición en al menos 6 proyectos, incluyendo 2 preguntas sobre libertad personal.",
    "Support": "Apoyo",
    "Oppose": "Me opongo",
    "This result comes only from the positions you took on these Oregon bills. It is a useful comparison, not a permanent label.": "Este resultado proviene solo de las posiciones que tomó sobre estos proyectos de ley de Oregón. Es una comparación útil, no una etiqueta permanente.",
    "Economic role": "Papel económico",
    "Personal liberty": "Libertad personal",
    "Smaller government role": "Papel gubernamental más pequeño",
    "Larger government role": "Papel gubernamental más grande",
    "Mixed government role": "Papel gubernamental mixto",
    "More personal liberty": "Más libertad personal",
    "More government restriction": "Más restricción gubernamental",
    "Mixed on personal liberty": "Mixto en libertad personal",
    "Closest voting records": "Historiales de votación más parecidos",
    "Eugene candidates with records on these 12 bills": "Candidatos de Eugene con historial en estos 12 proyectos",
    "James Manning Jr. and Julie Fahey are shown because they cast recorded votes on these bills. Their challengers are not assigned answers they did not cast.": "James Manning Jr. y Julie Fahey aparecen porque emitieron votos registrados sobre estos proyectos. A sus oponentes no se les asignan respuestas que no emitieron.",
    "Match percentages compare only questions you answered Support or Oppose with Yes/No votes the lawmaker cast. They do not predict agreement on other issues.": "Los porcentajes de coincidencia comparan solo las preguntas que usted respondió Apoyo u Me opongo con los votos Sí/No que emitió el legislador. No predicen coincidencias en otros temas.",

    /* ---- grades / votes scaffolding ---- */
    "Important:": "Importante:",
    "Grades are interpretations of a 16-vote record, and political-tendency labels are interpretations of the 12 samples shown here. They are not court rulings or claims about how lawmakers identify themselves. Open any lawmaker to inspect the full record for yourself.": "Las calificaciones son interpretaciones de un historial de 16 votos, y las etiquetas de tendencia política son interpretaciones de las 12 muestras que se muestran aquí. No son fallos judiciales ni afirmaciones sobre cómo se identifican los legisladores. Abra cualquier legislador para inspeccionar el historial completo por sí mismo.",
    "What do the grades mean?": "¿Qué significan las calificaciones?",
    "The 12 votes in Key Votes and Find Your Match remain representative samples.": "Los 12 votos en Votaciones clave y Encuentre su afinidad siguen siendo muestras representativas.",
    "Select any lawmaker’s card": "Seleccione la tarjeta de cualquier legislador",
    "to inspect all 16 bills, the stated scorecard position, and how that lawmaker voted. If a lawmaker had six or fewer eligible votes, the card shows “X of Y” and flags the limited record.": "para inspeccionar los 16 proyectos, la posición indicada en la tarjeta y cómo votó ese legislador. Si un legislador tuvo seis o menos votos elegibles, la tarjeta muestra «X de Y» y marca el historial limitado.",
    "Below 60%": "Menos del 60%",
    "Grade ranges": "Rangos de calificaciones",
    "Tap a grade to see how it's scored.": "Toque una calificación para ver cómo se calcula.",
    "Find and filter legislators": "Buscar y filtrar legisladores",
    "Search by name, district, or town": "Buscar por nombre, distrito o ciudad",
    "Example: Lebanon or Jami Cate": "Ejemplo: Lebanon o Jami Cate",
    "Chamber": "Cámara",
    "All": "Todos",
    "House": "Cámara de Representantes",
    "Senate": "Senado",
    "Party": "Partido",
    "Democrat (D)": "Demócrata (D)",
    "Republican (R)": "Republicano (R)",
    "Political tendency": "Tendencia política",
    "Grade": "Calificación",
    "Sort": "Ordenar",
    "Score: high to low": "Puntuación: de mayor a menor",
    "Name: A to Z": "Nombre: de A a Z",
    "“Political tendency” is inferred only from this scorecard’s recorded votes on government’s economic role and personal liberty. It is not a party registration or self-description.": "La «tendencia política» se infiere solo de los votos registrados en esta tarjeta sobre el papel económico del gobierno y la libertad personal. No es una afiliación partidaria ni una autodescripción.",
    "No legislators match those filters.": "Ningún legislador coincide con esos filtros.",
    "Try clearing a filter or changing the search.": "Pruebe borrar un filtro o cambiar la búsqueda.",
    "12 key votes": "12 votaciones clave",
    "Each scorecard position below is this methodology’s call, not an objective legal ruling.": "Cada posición de la tarjeta a continuación es el criterio de esta metodología, no un fallo legal objetivo.",
    "← Back to ballot": "← Volver a la boleta",
    "← Back to all grades": "← Volver a todas las calificaciones",
    "← Back to Find Your Match": "← Volver a Encuentre su afinidad"
  });

  Object.assign(ES, {
    /* ---- How It Works (method) ---- */
    "How the grades and labels work": "Cómo funcionan las calificaciones y las etiquetas",
    "This scorecard reflects ONE constitutionalist interpretation of the U.S. Constitution. It is not a court ruling or a legal fact — every grade links to the actual votes so you can judge for yourself.": "Esta tarjeta de puntuación refleja UNA interpretación constitucionalista de la Constitución de EE. UU. No es un fallo judicial ni un hecho legal: cada calificación enlaza con los votos reales para que usted juzgue por sí mismo.",
    "The calculation": "El cálculo",
    "Score = votes matching the stated scorecard position ÷": "Puntuación = votos que coinciden con la posición indicada en la tarjeta ÷",
    "Yes/No votes cast × 100, rounded to a whole number. Exact half-point ties round down.": "votos Sí/No emitidos × 100, redondeado a un número entero. Los empates exactos de medio punto se redondean hacia abajo.",
    "Excused or absent votes are not counted for or against a legislator. A vote from before a legislator took office is also not counted.": "Los votos excusados o ausentes no cuentan ni a favor ni en contra de un legislador. Un voto anterior a la toma de posesión de un legislador tampoco cuenta.",
    "Political-tendency labels": "Etiquetas de tendencia política",
    "The labels use two separate signals from the 12 displayed sample votes: preference for a larger or smaller government role in spending, regulation, and private contracts; and preference for greater personal liberty or greater government restriction in the four civil-liberty votes. “Libertarian-leaning” means smaller government on the first signal and greater personal liberty on the second. “Conservative,” “liberal / progressive,” “communitarian,” and middle-ground labels describe the other combinations. Because this is a narrow set of votes, the label is a starting point—not a complete political identity.": "Las etiquetas usan dos señales distintas de los 12 votos de muestra mostrados: la preferencia por un papel gubernamental más grande o más pequeño en el gasto, la regulación y los contratos privados; y la preferencia por una mayor libertad personal o una mayor restricción gubernamental en los cuatro votos sobre libertades civiles. «Tendencia libertaria» significa un gobierno más pequeño en la primera señal y mayor libertad personal en la segunda. «Conservadora», «liberal / progresista», «comunitaria» y las etiquetas intermedias describen las demás combinaciones. Como es un conjunto reducido de votos, la etiqueta es un punto de partida, no una identidad política completa.",
    "Quiz and lawmaker matches": "Cuestionario y coincidencias con legisladores",
    "The quiz asks how you would vote on the same 12 displayed samples. It compares only the support or opposition answers you give with each lawmaker’s recorded Yes/No votes. Skipped questions, absences, and votes from before a lawmaker took office are excluded. A match percentage is agreement on the questions both you and the lawmaker answered.": "El cuestionario pregunta cómo votaría usted en las mismas 12 muestras mostradas. Compara solo las respuestas de apoyo u oposición que usted da con los votos Sí/No registrados de cada legislador. Se excluyen las preguntas omitidas, las ausencias y los votos anteriores a la toma de posesión de un legislador. Un porcentaje de coincidencia es el acuerdo en las preguntas que tanto usted como el legislador respondieron.",
    "Data and scope": "Datos y alcance",
    "Grades use 16 recorded roll-call votes from the 2021, 2023, 2025, and 2026 Oregon legislative sessions. The four earlier votes extend the record behind the grade; the 12 votes shown in Key Votes and Find Your Match remain the displayed samples.": "Las calificaciones usan 16 votos nominales registrados de las sesiones legislativas de Oregón de 2021, 2023, 2025 y 2026. Los cuatro votos más antiguos amplían el historial detrás de la calificación; los 12 votos mostrados en Votaciones clave y Encuentre su afinidad siguen siendo las muestras mostradas.",
    "The roster is current as of October 2026: 30 senators and 60 representatives.": "La lista está actualizada a octubre de 2026: 30 senadores y 60 representantes.",
    "The bill list was seeded from the 2025 scorecard of the Freedom Index, a program of the John Birch Society that describes its scorecard as based on the U.S. Constitution. Positions and rationales were set independently for this site.": "La lista de proyectos partió de la tarjeta de puntuación de 2025 del Freedom Index, un programa de la John Birch Society que describe su tarjeta como basada en la Constitución de EE. UU. Las posiciones y justificaciones se establecieron de forma independiente para este sitio.",
    "One correction is noted in the data: the 340B pharmacy bill is HB 2385. An early draft mislabeled it HB 2309.": "Se anota una corrección en los datos: el proyecto de farmacia 340B es el HB 2385. Un borrador temprano lo etiquetó por error como HB 2309.",
    "Fewer votes and chamber changes": "Menos votos y cambios de cámara",
    "Legislators appointed mid-term have fewer scored votes: Lamar Wise and Matt Bunch took office in November 2025, and Sue Rieke Smith took office in May 2025. Their scores rest on fewer votes, shown as “X of Y.”": "Los legisladores nombrados a mitad de período tienen menos votos puntuados: Lamar Wise y Matt Bunch asumieron el cargo en noviembre de 2025, y Sue Rieke Smith asumió el cargo en mayo de 2025. Sus puntuaciones se basan en menos votos, mostrados como «X de Y».",
    "Christine Drazan changed from the House to the Senate in October 2025. Courtney Neron Misslin changed from the House to the Senate in May 2025. Their votes from both chambers are combined under one person.": "Christine Drazan pasó de la Cámara al Senado en octubre de 2025. Courtney Neron Misslin pasó de la Cámara al Senado en mayo de 2025. Sus votos de ambas cámaras se combinan en una sola persona.",
    "Why most positions are “No”": "Por qué la mayoría de las posiciones son «No»",
    "Fourteen of the 16 scored bills have a scorecard position of NO because the selected record includes spending, regulatory, and gun-restriction bills from 2021, 2023, and 2025. The two YES bills are from 2026.": "Catorce de los 16 proyectos puntuados tienen una posición de NO en la tarjeta porque el historial seleccionado incluye proyectos de gasto, regulación y restricción de armas de 2021, 2023 y 2025. Los dos proyectos con SÍ son de 2026.",
    "Note for fairness:": "Nota de imparcialidad:",
    "SB 1587 (2026) was scored YES and most Democrats voted with the scorecard position. The scorecard does not automatically favor one party; it follows the votes.": "El SB 1587 (2026) se puntuó SÍ y la mayoría de los demócratas votaron con la posición de la tarjeta. La tarjeta no favorece automáticamente a un partido; sigue los votos.",
    "Official resources": "Recursos oficiales",
    "Oregon Secretary of State election information:": "Información electoral de la Secretaría de Estado de Oregón:",
    "Voters’ pamphlet in 18 languages": "Folleto del votante en 18 idiomas",
    "Track your ballot or check your registration": "Rastree su boleta o verifique su registro",
    "Find a ballot drop box": "Encuentre un buzón oficial para boletas",
    "Questions about your ballot: call": "Preguntas sobre su boleta: llame al",
    "or": "o",
    "find your county clerk": "encuentre a su secretario del condado",

    /* ---- Measure guide ---- */
    "No statewide measures this November": "No hay medidas estatales este noviembre",
    "Oregon has no statewide ballot measures on the November 3, 2026 general election ballot.": "Oregón no tiene medidas estatales en la boleta de la elección general del 3 de noviembre de 2026.",
    "Local measures can still appear, and each voter’s ballot depends on their address and voting districts.": "Aun así pueden aparecer medidas locales, y la boleta de cada votante depende de su dirección y sus distritos electorales.",
    "How to read a local ballot measure": "Cómo leer una medida electoral local",
    "What is the measure asking?": "¿Qué pregunta la medida?",
    "Start with the official ballot title and question. Identify the exact action: approve, renew, repeal, authorize, or prohibit. Then read the explanatory statement for what changes in practice.": "Comience con el título y la pregunta oficiales de la boleta. Identifique la acción exacta: aprobar, renovar, derogar, autorizar o prohibir. Luego lea la declaración explicativa para saber qué cambia en la práctica.",
    "What does a “yes” vote do?": "¿Qué hace un voto «sí»?",
    "A yes vote approves the action described in the ballot title. Do not assume “yes” always means a new tax or a policy expansion; it may renew an existing measure.": "Un voto «sí» aprueba la acción descrita en el título de la boleta. No suponga que «sí» siempre significa un impuesto nuevo o una ampliación de políticas; puede renovar una medida existente.",
    "What does a “no” vote do?": "¿Qué hace un voto «no»?",
    "A no vote rejects the proposed action. For a renewal, that generally means the current levy or authority ends on its existing schedule rather than continuing under the proposed renewal.": "Un voto «no» rechaza la acción propuesta. En el caso de una renovación, generalmente significa que el impuesto o la autoridad actual termina en su fecha prevista en lugar de continuar bajo la renovación propuesta.",
    "Who pays?": "¿Quién paga?",
    "Look for the tax base and district boundary. A property-tax measure is paid by taxable properties inside the named district, using assessed value. Other measures may use fees, bonds, or another funding source.": "Busque la base impositiva y el límite del distrito. Una medida de impuesto predial la pagan las propiedades sujetas a impuestos dentro del distrito mencionado, según el valor fiscal. Otras medidas pueden usar tarifas, bonos u otra fuente de financiamiento.",
    "How much does it cost?": "¿Cuánto cuesta?",
    "For a rate stated “per $1,000 of assessed value,” divide the property’s assessed value by 1,000, then multiply by the rate. Assessed value may differ from market value.": "Para una tasa expresada «por cada $1,000 de valor fiscal», divida el valor fiscal de la propiedad entre 1,000 y luego multiplique por la tasa. El valor fiscal puede diferir del valor de mercado.",
    "How long does it last?": "¿Cuánto dura?",
    "Find the start date, end date, or number of years in the official measure. “Renewal” does not mean permanent. If the summary is unclear, use the full ballot title and explanatory statement.": "Busque la fecha de inicio, la fecha de fin o el número de años en la medida oficial. «Renovación» no significa permanente. Si el resumen no es claro, use el título completo de la boleta y la declaración explicativa.",
    "Where is the official wording?": "¿Dónde está el texto oficial?",
    "Use your county voters’ pamphlet. It contains the ballot title, question, summary, explanatory statement, and any submitted arguments. Read the official text before relying on campaign mail.": "Use el folleto del votante de su condado. Contiene el título de la boleta, la pregunta, el resumen, la declaración explicativa y cualquier argumento presentado. Lea el texto oficial antes de confiar en el correo de campaña.",
    "Does every Oregon voter see the same local measures?": "¿Todos los votantes de Oregón ven las mismas medidas locales?",
    "No. City, county, school district, fire district, and other local boundaries determine which measures appear on a voter’s ballot.": "No. Los límites de la ciudad, el condado, el distrito escolar, el distrito de bomberos y otros límites locales determinan qué medidas aparecen en la boleta de un votante.",
    "Find the measures on your ballot": "Encuentre las medidas en su boleta",
    "Open the voters’ pamphlet for the county where you are registered.": "Abra el folleto del votante del condado donde está registrado.",
    "Find the section for your city, school district, fire district, or other local district.": "Busque la sección de su ciudad, distrito escolar, distrito de bomberos u otro distrito local.",
    "Read the official ballot title and explanatory statement for each measure.": "Lea el título oficial de la boleta y la declaración explicativa de cada medida.",
    "to reach Oregon election information and county election resources.": "para llegar a la información electoral de Oregón y los recursos electorales del condado.",

    /* ---- feedback ---- */
    "Help improve this voter guide": "Ayude a mejorar esta guía para votantes",
    "Tell us whether the guide made your ballot easier to understand. Specific praise and criticism both help decide what to fix next.": "Díganos si la guía hizo que su boleta fuera más fácil de entender. Tanto los elogios como las críticas específicas ayudan a decidir qué corregir después.",
    "Overall, how helpful was this guide?": "En general, ¿qué tan útil fue esta guía?",
    "Helpfulness rating from 1 to 5": "Calificación de utilidad del 1 al 5",
    "Not helpful": "No fue útil",
    "Very helpful": "Muy útil",
    "After using the guide, how clear are you about who and what you are voting for?": "Después de usar la guía, ¿qué tan claro tiene por quién y por qué está votando?",
    "Much clearer": "Mucho más claro",
    "Somewhat clearer": "Algo más claro",
    "No clearer": "Nada más claro",
    "What was most helpful?": "¿Qué fue lo más útil?",
    "What should we fix, add, or explain better?": "¿Qué deberíamos corregir, añadir o explicar mejor?",
    "May we quote your comments as a testimonial?": "¿Podemos citar sus comentarios como testimonio?",
    "Keep private": "Mantener en privado",
    "Quote anonymously": "Citar de forma anónima",
    "Quote with my first name": "Citar con mi nombre",
    "First name": "Nombre",
    "(optional)": "(opcional)",
    "Submit feedback": "Enviar comentarios",
    "Your feedback will be sent to VoterLens. A complete copy will also appear below so you can save or email it if you choose.": "Sus comentarios se enviarán a VoterLens. Una copia completa también aparecerá a continuación para que pueda guardarla o enviarla por correo si lo desea.",
    "Feedback submitted. A complete copy is ready below.": "Comentarios enviados. Una copia completa está lista a continuación.",
    "Your email is ready": "Su correo está listo",
    "Complete message": "Mensaje completo",
    "Copy complete email": "Copiar el correo completo",
    "Copy email address": "Copiar la dirección de correo",
    "On a computer, copy the complete email, open your usual email website or app, paste it into a new message, and send it to the address above.": "En una computadora, copie el correo completo, abra su sitio o aplicación de correo habitual, péguelo en un mensaje nuevo y envíelo a la dirección anterior.",
    "Complete email copied. Paste it into a new message in your email app.": "Correo completo copiado. Péguelo en un mensaje nuevo en su aplicación de correo.",
    "Email address copied.": "Dirección de correo copiada.",
    "Copying was blocked. Select the text above and copy it manually.": "La copia fue bloqueada. Seleccione el texto anterior y cópielo manualmente.",

    /* ---- voting modes workspace (prep / booth) ---- */
    "Change voting mode": "Cambiar el modo de votación",
    "Get ready for the polls": "Prepárese para votar en persona",
    "Research at home, then mark one choice for each race in your personal pick list.": "Investigue en casa y luego marque una opción por cada contienda en su lista personal de selecciones.",
    "Build your pick list": "Haga su lista de selecciones",
    "Research each race, then mark the choice you plan to make at the polls.": "Investigue cada contienda y luego marque la opción que planea elegir al votar.",
    "No pick yet": "Aún sin selección",
    "My pick": "Mi selección",
    "Read full explainer": "Leer la explicación completa",
    "Download offline pick list": "Descargar la lista para usar sin conexión",
    "Text this list to yourself": "Enviarme esta lista por mensaje de texto",
    "Text this link to yourself — it reopens your exact pick list on any device, even at the polls.": "Envíese este enlace por mensaje de texto: reabre su lista exacta de selecciones en cualquier dispositivo, incluso en el lugar de votación.",
    "Your choices stay only in this open page. Download the list before you leave so it is available without reception.": "Sus selecciones permanecen solo en esta página abierta. Descargue la lista antes de salir para tenerla disponible sin señal.",
    "First, find your local ballot below.": "Primero, encuentre su boleta local a continuación.",
    "This tool will appear as soon as you choose your district or ward.": "Esta herramienta aparecerá en cuanto elija su distrito.",
    "At the polls": "En el lugar de votación",
    "Find your ballot first. Then booth mode will show one race at a time with large tap targets.": "Primero encuentre su boleta. Luego, el modo de cabina mostrará una contienda a la vez con botones grandes.",
    "No candidate races were found on this ballot.": "No se encontraron contiendas de candidatos en esta boleta.",
    "One quick note before you start.": "Una nota rápida antes de empezar.",
    "Heads up: some polling places restrict phone use — check your local rules before using your phone in the booth. And never photograph your ballot — that's illegal in many states.": "Atención: algunos lugares de votación restringen el uso del teléfono; consulte las reglas locales antes de usar su teléfono en la cabina. Y nunca fotografíe su boleta: es ilegal en muchos estados.",
    "Continue to my checklist": "Continuar a mi lista",
    "Booth mode": "Modo de cabina",
    "Walk down your ballot one race at a time.": "Recorra su boleta una contienda a la vez.",
    "Download offline copy": "Descargar copia sin conexión",
    "No pick saved": "Ninguna selección guardada",
    "Previous race": "Contienda anterior",
    "Next race": "Contienda siguiente",
    "This view keeps working while the page remains open. The downloaded copy works after you lose reception or close the page.": "Esta vista sigue funcionando mientras la página permanezca abierta. La copia descargada funciona después de perder la señal o cerrar la página.",
    "Your pick-list link": "El enlace de su lista de selecciones",
    "Open in Messages": "Abrir en Mensajes",
    "Copy link": "Copiar enlace",
    "Anyone who opens this link sees these picks — send it to yourself, or share it only with people you trust.": "Cualquiera que abra este enlace verá estas selecciones: envíeselo a usted mismo o compártalo solo con personas de confianza.",
    "Offline pick list downloaded.": "Lista de selecciones sin conexión descargada.",
    "Link copied — paste it into a text message to yourself.": "Enlace copiado: péguelo en un mensaje de texto para usted.",
    "Copy did not work — tap the link above, select it, and copy it by hand.": "La copia no funcionó: toque el enlace anterior, selecciónelo y cópielo manualmente."
  });

  /* Issue labels used inside quiz comparison sentences (the frame translates;
     an unrecognized label is left as-is rather than guessed). */
  var ISSUE_LABELS = {
    "housing": "vivienda",
    "tax and spending restraint": "moderación de impuestos y gasto",
    "health-care access": "acceso a la atención médica",
    "public safety": "seguridad pública",
    "personal freedom": "libertad personal",
    "local control": "control local",
    "spending restraint": "moderación del gasto",
    "gun restrictions": "restricciones a las armas",
    "small-town growth": "crecimiento de los pueblos pequeños",
    "the jail levy": "el impuesto para la cárcel"
  };
  var ISSUE_LABELS_REV = {};
  Object.keys(ISSUE_LABELS).forEach(function (k) { ISSUE_LABELS_REV[ISSUE_LABELS[k]] = k; });

  function pluralAlign(n, esPlural) {
    return n === "1" ? "1 coincidencia documentada." : n + (esPlural ? " coincidencias documentadas." : " documented alignments.");
  }
  var PATTERNS = [
    { re: /^(\d+) of (\d+) positions taken$/, es: function (m) { return m[1] + " de " + m[2] + " posiciones tomadas"; },
      reEs: /^(\d+) de (\d+) posiciones tomadas$/, en: function (m) { return m[1] + " of " + m[2] + " positions taken"; } },
    { re: /^(\d+) of (\d+) answered$/, es: function (m) { return m[1] + " de " + m[2] + " respondidas"; },
      reEs: /^(\d+) de (\d+) respondidas$/, en: function (m) { return m[1] + " of " + m[2] + " answered"; } },
    { re: /^\((\d+) answers\)$/, es: function (m) { return "(" + m[1] + " respuestas)"; },
      reEs: /^\((\d+) respuestas\)$/, en: function (m) { return "(" + m[1] + " answers)"; } },
    { re: /^(\d+) candidates$/, es: function (m) { return m[1] + " candidatos"; },
      reEs: /^(\d+) candidatos$/, en: function (m) { return m[1] + " candidates"; } },
    { re: /^1 candidate$/, es: function () { return "1 candidato"; },
      reEs: /^1 candidato$/, en: function () { return "1 candidate"; } },
    { re: /^ZIP (\d{5})$/, es: function (m) { return "Código postal " + m[1]; },
      reEs: /^Código postal (\d{5})$/, en: function (m) { return "ZIP " + m[1]; } },
    { re: /^Race (\d+) of (\d+)$/, es: function (m) { return "Contienda " + m[1] + " de " + m[2]; },
      reEs: /^Contienda (\d+) de (\d+)$/, en: function (m) { return "Race " + m[1] + " of " + m[2]; } },
    { re: /^(\d+) of (\d+) picks saved in this open page$/, es: function (m) { return m[1] + " de " + m[2] + " selecciones guardadas en esta página abierta"; },
      reEs: /^(\d+) de (\d+) selecciones guardadas en esta página abierta$/, en: function (m) { return m[1] + " of " + m[2] + " picks saved in this open page"; } },
    { re: /^Showing (\d+) of (\d+) legislators$/, es: function (m) { return "Mostrando " + m[1] + " de " + m[2] + " legisladores"; },
      reEs: /^Mostrando (\d+) de (\d+) legisladores$/, en: function (m) { return "Showing " + m[1] + " of " + m[2] + " legislators"; } },
    { re: /^Your top alignments? matched (\d+) of your scored answers\.$/, es: function (m) { return "Su coincidencia principal coincidió en " + m[1] + " de sus respuestas puntuadas."; },
      reEs: /^Su coincidencia principal coincidió en (\d+) de sus respuestas puntuadas\.$/, en: function (m) { return "Your top alignment matched " + m[1] + " of your scored answers."; } },
    { re: /^(\d+) documented alignments?\.$/, es: function (m) { return pluralAlign(m[1], true); },
      reEs: /^(\d+) coincidencias? documentadas?\.$/, en: function (m) { return m[1] + (m[1] === "1" ? " documented alignment." : " documented alignments."); } },
    { re: /^(\d+) of (\d+)$/, es: function (m) { return m[1] + " de " + m[2]; },
      reEs: /^(\d+) de (\d+)$/, en: function (m) { return m[1] + " of " + m[2]; } }
  ];

  var PREFIXES = [
    ["Your pick: ", "Su selección: "],
    ["Sponsored by ", "Patrocinado por "]
  ];
  var SUFFIXES = [
    [" · top match:", " · mejor coincidencia:"]
  ];

  function segmentTranslate(core) {
    if (core.indexOf(" your answer on ") === -1) return null;
    var changed = false;
    var out = core.replace(/(matches|differs from) your answer on ([^;.]+)/g, function (all, verb, label) {
      changed = true;
      return (verb === "matches" ? "coincide con" : "difiere de") + " su respuesta sobre " + (ISSUE_LABELS[label] || label);
    });
    return changed ? out : null;
  }
  function segmentRestore(core) {
    if (core.indexOf(" su respuesta sobre ") === -1) return null;
    var changed = false;
    var out = core.replace(/(coincide con|difiere de) su respuesta sobre ([^;.]+)/g, function (all, verb, label) {
      changed = true;
      return (verb === "coincide con" ? "matches" : "differs from") + " your answer on " + (ISSUE_LABELS_REV[label] || label);
    });
    return changed ? out : null;
  }

  function translateCore(core) {
    if (Object.prototype.hasOwnProperty.call(ES, core)) return ES[core];
    var m = core.match(/^the documented position (matches|differs from|cannot be compared with) your answer on (.+?)\.$/);
    if (m) {
      var verbs = { "matches": "coincide con", "differs from": "difiere de", "cannot be compared with": "no se puede comparar con" };
      return "la posición documentada " + verbs[m[1]] + " su respuesta sobre " + (ISSUE_LABELS[m[2]] || m[2]) + ".";
    }
    for (var i = 0; i < PATTERNS.length; i++) {
      var mm = core.match(PATTERNS[i].re);
      if (mm) return PATTERNS[i].es(mm);
    }
    var seg = segmentTranslate(core);
    if (seg !== null) return seg;
    for (var p = 0; p < PREFIXES.length; p++) {
      if (core.indexOf(PREFIXES[p][0]) === 0 && core.length > PREFIXES[p][0].length) return PREFIXES[p][1] + core.slice(PREFIXES[p][0].length);
    }
    for (var s = 0; s < SUFFIXES.length; s++) {
      if (core.slice(-SUFFIXES[s][0].length) === SUFFIXES[s][0]) return core.slice(0, core.length - SUFFIXES[s][0].length) + SUFFIXES[s][1];
    }
    return null;
  }

  var ES_REV = {};
  Object.keys(ES).forEach(function (k) { if (ES[k] && !Object.prototype.hasOwnProperty.call(ES_REV, ES[k])) ES_REV[ES[k]] = k; });
  function restoreCore(core) {
    if (Object.prototype.hasOwnProperty.call(ES_REV, core)) return ES_REV[core];
    var m = core.match(/^la posición documentada (coincide con|difiere de|no se puede comparar con) su respuesta sobre (.+?)\.$/);
    if (m) {
      var verbs = { "coincide con": "matches", "difiere de": "differs from", "no se puede comparar con": "cannot be compared with" };
      return "the documented position " + verbs[m[1]] + " your answer on " + (ISSUE_LABELS_REV[m[2]] || m[2]) + ".";
    }
    for (var i = 0; i < PATTERNS.length; i++) {
      var mm = core.match(PATTERNS[i].reEs);
      if (mm) return PATTERNS[i].en(mm);
    }
    var seg = segmentRestore(core);
    if (seg !== null) return seg;
    for (var p = 0; p < PREFIXES.length; p++) {
      if (core.indexOf(PREFIXES[p][1]) === 0 && core.length > PREFIXES[p][1].length) return PREFIXES[p][0] + core.slice(PREFIXES[p][1].length);
    }
    for (var s = 0; s < SUFFIXES.length; s++) {
      if (core.slice(-SUFFIXES[s][1].length) === SUFFIXES[s][1]) return core.slice(0, core.length - SUFFIXES[s][1].length) + SUFFIXES[s][0];
    }
    return null;
  }

  /* ---- engine ---- */
  var originals = new Map();
  var attrOriginals = new Map();
  var lang = "en";
  var applying = false;
  var origTitle = document.title;

  function isExcluded(node) {
    var el = node.parentElement;
    while (el) {
      if (el.id === "admin-app" || el.id === "lang-toggle" || el.id === "email-preview") return true;
      if (el.getAttribute && el.getAttribute("data-i18n-skip") !== null) return true;
      var t = el.tagName;
      if (t === "SCRIPT" || t === "STYLE" || t === "TEXTAREA" || t === "NOSCRIPT") return true;
      el = el.parentElement;
    }
    return false;
  }
  function wrap(original, core) {
    var lead = original.match(/^\s*/)[0];
    var trail = original.match(/\s*$/)[0];
    return lead + core + trail;
  }
  function eachTextNode(root, fn) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) { return isExcluded(n) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
    });
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(fn);
  }
  function translateTextNode(node) {
    if (originals.has(node)) return;
    var v = node.nodeValue;
    if (!v) return;
    var core = v.trim();
    if (!core) return;
    var t = translateCore(core);
    if (t !== null && t !== core) {
      originals.set(node, v);
      node.nodeValue = wrap(v, t);
    }
  }
  var ATTRS = ["placeholder", "aria-label", "title"];
  function translateAttrs(root) {
    var els = root.querySelectorAll("[placeholder],[aria-label],[title]");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.id === "lang-toggle") continue;
      if (el.closest && (el.closest("#admin-app") || el.closest("[data-i18n-skip]"))) continue;
      for (var a = 0; a < ATTRS.length; a++) {
        var name = ATTRS[a];
        var v = el.getAttribute(name);
        if (!v) continue;
        var core = v.trim();
        if (!core) continue;
        var t = translateCore(core);
        if (t === null || t === core) continue;
        var rec = attrOriginals.get(el);
        if (!rec) { rec = {}; attrOriginals.set(el, rec); }
        if (!(name in rec)) rec[name] = v;
        el.setAttribute(name, wrap(v, t));
      }
    }
  }
  function restoreAll() {
    applying = true;
    originals.forEach(function (orig, node) { if (node.isConnected) node.nodeValue = orig; });
    originals.clear();
    attrOriginals.forEach(function (rec, el) {
      if (!el.isConnected) return;
      Object.keys(rec).forEach(function (a) { el.setAttribute(a, rec[a]); });
    });
    attrOriginals.clear();
    if (document.body) {
      eachTextNode(document.body, function (node) {
        var v = node.nodeValue;
        if (!v) return;
        var core = v.trim();
        if (!core) return;
        var r = restoreCore(core);
        if (r !== null && r !== core) node.nodeValue = wrap(v, r);
      });
      var els = document.querySelectorAll("[placeholder],[aria-label],[title]");
      for (var i = 0; i < els.length; i++) {
        for (var a = 0; a < ATTRS.length; a++) {
          var name = ATTRS[a];
          var v = els[i].getAttribute(name);
          if (!v) continue;
          var core = v.trim();
          if (!core) continue;
          var r = restoreCore(core);
          if (r !== null && r !== core) els[i].setAttribute(name, wrap(v, r));
        }
      }
    }
    document.title = origTitle;
    applying = false;
  }

  function makeNote() {
    var p = document.createElement("p");
    p.className = "lang-note-es";
    p.setAttribute("data-i18n-skip", "1");
    p.setAttribute("role", "note");
    p.textContent = NOTE_ES;
    return p;
  }
  function insertNotes() {
    ["expanded-confirm", "ward-confirm", "cottage-confirm", "albany-confirm"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el || el.querySelector(".lang-note-es")) return;
      var form = el.querySelector("form");
      if (form) el.insertBefore(makeNote(), form);
      else el.appendChild(makeNote());
    });
    ["expanded-result", "ballot-result", "cottage-result", "albany-result"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el || el.querySelector(".lang-note-es")) return;
      var host = el.querySelector(".ballot-summary") || el;
      var h2 = host.querySelector("h2");
      if (h2 && h2.nextSibling) host.insertBefore(makeNote(), h2.nextSibling);
      else host.appendChild(makeNote());
    });
  }

  function syncButton() {
    var b = document.getElementById("lang-toggle");
    if (!b) return;
    b.textContent = lang === "es" ? "English" : "Español";
    b.setAttribute("aria-label", lang === "es" ? "Switch to English" : "Cambiar a español");
    b.setAttribute("aria-pressed", lang === "es" ? "true" : "false");
  }
  function applyLang(next) {
    lang = next;
    document.documentElement.setAttribute("lang", next === "es" ? "es" : "en");
    document.documentElement.classList.toggle("vl-es", next === "es");
    syncButton();
    if (next === "es") {
      applying = true;
      if (document.body) { eachTextNode(document.body, translateTextNode); translateAttrs(document.body); }
      if (ES[origTitle]) document.title = ES[origTitle];
      applying = false;
    } else {
      restoreAll();
    }
    try { window.localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
  }

  var rafPending = false;
  function scheduleApply() {
    if (rafPending || lang !== "es") return;
    rafPending = true;
    var run = function () {
      rafPending = false;
      if (lang !== "es" || applying || !document.body) return;
      applying = true;
      eachTextNode(document.body, translateTextNode);
      translateAttrs(document.body);
      applying = false;
    };
    if (window.requestAnimationFrame) window.requestAnimationFrame(run);
    else setTimeout(run, 50);
  }
  function startObserver() {
    if (!window.MutationObserver || !document.body) return;
    var obs = new MutationObserver(function () { if (!applying) scheduleApply(); });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function init() {
    insertNotes();
    var btn = document.getElementById("lang-toggle");
    if (btn) btn.addEventListener("click", function () { applyLang(lang === "es" ? "en" : "es"); });
    var initial = "en";
    try {
      var q = new URLSearchParams(window.location.search).get("lang");
      if (q === "es" || q === "en") initial = q;
      else {
        var saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved === "es" || saved === "en") initial = saved;
      }
    } catch (e) {}
    if (initial === "es") applyLang("es");
    else syncButton();
    startObserver();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
