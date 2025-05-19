CREATE TYPE status_nikah AS ENUM('Jomblo', 'Kawin');
CREATE TYPE branches AS ENUM('branch1', 'branch2', 'branch3');
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE Candidate (
    CandidateID UUID PRIMARY KEY DEFAULT uuid_generate_v1(),
    Name VARCHAR(100) NOT NULL,
    image_url VARCHAR(255),
    Description TEXT
);

CREATE TABLE Voter (
    VoterID UUID PRIMARY KEY DEFAULT uuid_generate_v1(),
    isAdmin BOOLEAN DEFAULT FALSE NOT NULL,
    Name VARCHAR(100) NOT NULL,
    Password VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Age INT NOT NULL,
    Status status_nikah,
    Region branches NOT NULL DEFAULT 'branch1'
);

CREATE TABLE branch1 (
    VoteID UUID PRIMARY KEY DEFAULT uuid_generate_v1(),
    Voter UUID NOT NULL,
    CandidateID UUID NOT NULL,
    FOREIGN KEY (Voter) REFERENCES Voter(VoterID) ON DELETE CASCADE,
    FOREIGN KEY (CandidateID) REFERENCES Candidate(CandidateID) ON DELETE CASCADE
);

CREATE TABLE branch2 (
    VoteID UUID PRIMARY KEY DEFAULT uuid_generate_v1(),
    Voter UUID NOT NULL,
    CandidateID UUID NOT NULL,
    FOREIGN KEY (Voter) REFERENCES Voter(VoterID) ON DELETE CASCADE,
    FOREIGN KEY (CandidateID) REFERENCES Candidate(CandidateID) ON DELETE CASCADE
);

CREATE TABLE branch3 (
    VoteID UUID PRIMARY KEY DEFAULT uuid_generate_v1(),
    Voter UUID NOT NULL,
    CandidateID UUID NOT NULL,
    FOREIGN KEY (Voter) REFERENCES Voter(VoterID) ON DELETE CASCADE,
    FOREIGN KEY (CandidateID) REFERENCES Candidate(CandidateID) ON DELETE CASCADE
);

CREATE TABLE main (
    VoteID UUID PRIMARY KEY DEFAULT uuid_generate_v1(),
    Voter UUID,
    CandidateID UUID,
    Branch branches NOT NULL,
    FOREIGN KEY (Voter) REFERENCES Voter(VoterID) ON DELETE CASCADE,
    FOREIGN KEY (CandidateID) REFERENCES Candidate(CandidateID) ON DELETE CASCADE
);

CREATE TABLE countdown (
    countdownID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    end_time TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 hour'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Candidate VALUES
('00000000-0000-0000-0000-000000000001', 'Alice', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYJdvMCLnoRNJS71p04s2ahHfBmzcOTIwtQg&s', 'Strong leader'),
('00000000-0000-0000-0000-000000000002', 'Bob', 'https://cdn.britannica.com/33/198133-050-CDC2D757/Joko-Widodo.jpg', 'Great communicator');

INSERT INTO Voter VALUES
('11111111-1111-1111-1111-111111111111', FALSE, 'John', 'pass123', 'john@example.com', 25, 'Jomblo'),
('22222222-2222-2222-2222-222222222222', FALSE, 'Jane', 'pass456', 'jane@example.com', 30, 'Kawin');

INSERT INTO branch1 VALUES
('aaaaaaa1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001');

INSERT INTO branch2 VALUES
('bbbbbbb2-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000002');

INSERT INTO branch3 VALUES
('ccccccc3-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000002');

INSERT INTO main (VoteID, Voter, CandidateID, Branch)
SELECT VoteID, Voter, CandidateID, 'branch1'::branches FROM branch1
UNION
SELECT VoteID, Voter, CandidateID, 'branch2'::branches FROM branch2
UNION
SELECT VoteID, Voter, CandidateID, 'branch3'::branches FROM branch3;

INSERT INTO countdown DEFAULT VALUES;
