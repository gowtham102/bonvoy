import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EwasteComponent } from './ewaste.component';

describe('EwasteComponent', () => {
  let component: EwasteComponent;
  let fixture: ComponentFixture<EwasteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EwasteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EwasteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
