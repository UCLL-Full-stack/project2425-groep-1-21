# Report

- Full Name: Victor Trappeniers
- Student Number: r0947681
- Full Name of person you made your full stack project with: Efe Okan
- Student Number of person you made your full stack project with: r0924503
- Brief description of your project and the technologies used for front- and back-end: 
  - Front-end: React
  - Back-end: Typescript
  - beschrijving project: We hebben aan een site gewerkt waar een jeugdbeweging hun agendapunten kan laten zien aan (ouders van) leden.

# Cryptography

## Before

Er in geen encryptie van data van front- naar back-end. 
Wachtwoorden worden met behulp van het bcrypt algoritme gehasht opgeslagen in de back-end

## After

- gehouden: Alles want de bcrypt hashing is goed genoeg als de server over https praat, aangezien deze runt op localhost is dit niet mogelijk

## Code Examples

Geen Veranderingen

# Injections

(maximum a half A4-page of text, code snippets and screenshots not included)

## Before

Er wordt op meerdere plaatsen nagekeken of de meegegeven elementen weldegelijk zijn wat ze moeten zijn.
De database queries worden uitgevoerd door een externe library, prisma dus een sql injectie is niet mogelijk.
De Cors van de backend accepteerd ook alleen maar requests van localhost:8080, dus een andere bron wordt genegeerd.
Er is verder geen manier om bestanden naar de backend te uploaden.
## After

Geen veranderingen aan de code

## Code Examples

-

# Class 04 Vulnerable & Outdated components

## SBOM & Dependency Check

Ik heb een SBOM gegenereerd met behulp van cdxgen, een npm tool. Eerst wou ik het met behulp van het commando 'npm sbom' doen maar dit bleef errors gooien dus ben ik op zoek gegaan naar een andere methode, na even zoeken had ik die gevonden. Een probleem dat ik had was dat er exacte versie nummers gebruikt moesten worden en geen die gebruik maatken van "^" voor de versie.

Ik heb het commando "npm audit" gebruikt, front en back-end zijn beide node projecten.

## Vulnerabilities

- Front-end:
  - @babel/runtime  <7.26.10  
    Severity: moderate  
    Babel has inefficient RegExp complexity in generated code with .replace when transpiling named capturing groups  
  
  - cross-spawn  7.0.0 - 7.0.4  
    Severity: high  
    Regular Expression Denial of Service (ReDoS) in cross-spawn  
  
  - nanoid  <3.3.8  
    Severity: moderate  
    Predictable results in nanoid generation when given non-integer values  

  - next  9.5.5 - 14.2.24  
    Severity: critical  
    Next.js Cache Poisoning  
    Denial of Service condition in Next.js image optimization  
    Next.js authorization bypass vulnerability  
    Next.js Allows a Denial of Service (DoS) with Server Actions  
    Authorization Bypass in Next.js Middleware  

- Back-end:
  - @babel/helpers  <7.26.10  
    Severity: moderate  
    Babel has inefficient RegExp complexity in generated code with .replace when transpiling named capturing groups  

  - @babel/runtime  <7.26.10  
    Severity: moderate   
    Babel has inefficient RegExp complexity in generated code with .replace when transpiling named capturing groups  

  - body-parser  <1.20.3  
    Severity: high  
    body-parser vulnerable to denial of service when url encoding is enabled  

  - cookie  <0.7.0  
    cookie accepts cookie name, path, and domain with out of bounds characters

  - cross-spawn  7.0.0 - 7.0.4  
    Severity: high  
    Regular Expression Denial of Service (ReDoS) in cross-spawn

  - micromatch  <4.0.8  
    Severity: moderate  
    Regular Expression Denial of Service (ReDoS) in micromatch

  - path-to-regexp  <=0.1.11  
    Severity: high  
    Unpatched `path-to-regexp` ReDoS in 0.1.x  
    path-to-regexp outputs backtracking regular expressions

  - semver  7.0.0 - 7.5.1  
    Severity: high  
    semver vulnerable to Regular Expression Denial of Service

  - send  <0.19.0  
    send vulnerable to template injection that can lead to XSS

## Vulnerabilities - Updated

Ik heb gebprobeerd alle vulnerabilities te upgraden omdat er toch wel wat grote waren. Ik heb deze allemaal geupgrade omdat deze vulnerablities dan al zeker gepatchet zijn.

Er is 1 vulnerabilty in de back-end die ikl er niet uit kreeg omdat andere packages er dependent op zijn en het commando "npm audit fix" deed niets.
  - semver  7.0.0 - 7.5.1  
    Severity: high  
    semver vulnerable to Regular Expression Denial of Service

# Class 05/06/07 - Authentication, Session Management & Authorization

(guideline: max 2 A4 pages, images/code snippets not counted)
Describe each of the following functionalities in your application AS IS:

- user registration & user removal:  
  Gebruikers kunnen enkel worden aangemaakt door een andere gebruiker met een admin rol (de rollen Hoofdleiding en Admin), deze rollen zijn ook de enigen die een user kunnen verwijderen.

- user authentication:  
  Gebruikers worden geauthenticate aan de hand van hun username en passwoord, hierna krijgen ze een jwt token met hun totem (username), rol en groep naam in zodat ze de nodige zaken kunnen zien en aanpassen die voor hun van toepassing zijn.

- password forgotten:  
  Nog geen implementatie

- change password:  
  Nog geen implementatie

- session management (Stateful or Stateless, how session information is being created, stored and transferred, where do you access it, where do you verify it, how do you terminate it, ...). Also include screenshot(s) of the whole cookie/token/header (so I can clearly see all properties and the value).

  De sessies zijn stateless, er wordt gebruik gemaakt van jwt tokens. Tokens worden in de backend gemaakt en opgeslagen na een login, hierin zit zoals eerder vermeld de rol, de username en de groepsnaam. De tokens zijn 2 uur geldig en vervallen dan automatisch om eeuwig durende tokens te vermijden. Tokens worden client-side opgeslagen in de sessionstorage, dus deze worden gewist als de browser sluit.

  ![Voorbeeld request](request.png?raw=true 'Voorbeeld request')

- access control (what roles, permissions, ... do you have and how and where do you check them, but also do you enable CORS and/or CSP and/or CSRF and how did you configure it)  
  Er zijn 3 rollen:
    - Leiding: de Basis rol die toegang geeft tot de backend maar niet alle functionaliteiten heeft.
    - Hoofdleiding (Admin): Deze kan zo goed als alles, users toevoegen en verwijderen + een paar niche dingen die gewone leiding niet hoeft te kunnen
    - Admin (Superadmin): Deze is er om te zorgen dat de site niet per ongeluk zonder Admin zou vallen, de belangrijkste taak van deze rol is mensen de Hoofdleiding rol te geven/ontnemen.

  Er wordt ook gebruik gemaakt van cors in de backend, deze staat nu ingesteld op localhost:8080 omdat het project enkel lokaal draait, moest deze effectief gedeployed worden dan zou deze veranderen naar het ip-adres van de front-end. Deze staat geconfigureerd in de app.ts

For the functionalities you did not have yet, implement them. Or if not feasible, describe how you would implement them but why it's not feasible for you. When evaluating this, based on what we saw in class, did you improve your functionalities or code? If so, please explain what you changed and why.

How did you test/check for vulnerabilities?
Were you able to perform any kind of session attack or access control on your application?

# Class 08 - Secure CI/CD & Supply Chain

## Project for this course

To what phase in the CI/CD cycle did your application go and what threats could you possibly identify (categorize per SLSA item)?
Were you able to mitigate one of them?
If yes, explain how you did it.
If not, why was it impossible to mitigate?

## Project for the SE course

Did you follow the SE topic already or are you following it in parallel? If yes, can you identify possible threats in that project?
Were you able to mitigate one of them?
If yes, explain how you did it.
If not, why was it impossible to mitigate?

# Class 09 SSRF

Does your application process user controlled URL's? If yes, would an SSRF attack be possible? Were you able to mitigate this risk, and how? (max. 10 lines)

# Class 09 Logging & Monitoring

Evaluate the 7 sacred rules against your application. What logging framework do you use or did you implement on top?
Can you provide me with a valuable snippet of the logging for a 5 minute use of the application?

(max. 10 lines + print screen of log)

# Class 09 SAST

What SAST Tool did you install in your IDE?

What errors did you get (copy paste the basic error messages)?

What errors were you able to fix, and how? (max 3 lines per fix)

# Class 09 DAST

Launch ZAP egainst your application. First not authenticated, then in a second scan being authenticated.

Export each result to a report and add to appendix.

What errors were you able to fix, and how? (max 3 lines per fix)

# Class 10 topic

# Conclusion

Write a conclusion (most important thing you changed and learned) and identify at least one example (per security principle) of how you implemented the security principles.

# Appendix

## Tools used

Mention here all the tools/libraries you used for improving the security.
Provide me below with both pentest reports from ZAP:
### ZAP Test (non authenticated)
### ZAP Test (authenticated)

## Vulnerabilities discovered

Put here the full list of CVE's you found that were applicable to your code (or the libraries you used)

### SBOM

Put here your SBOM file.

## Most interesting conversation with a GenAI tool

Here, I expect you to copy paste a full transcript of the most interesting conversation you had with a genAI tool (also mention which one and what version).
